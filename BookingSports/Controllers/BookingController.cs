// Controllers/BookingController.cs
using BookingSports.Models;
using BookingSports.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BookingSports.Controllers
{
    [Route("api/booking")]
    [ApiController]
    
    public class BookingController : ControllerBase
    {
        private readonly IBookingService       _bookingService;
        private readonly ISportFacilityService _facilityService;
        private readonly ICoachService         _coachService;

        public BookingController(
            IBookingService bookingService,
            ISportFacilityService facilityService,
            ICoachService coachService)
        {
            _bookingService  = bookingService;
            _facilityService = facilityService;
            _coachService    = coachService;
        }

        // GET api/booking           ← доступно только ADMIN
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllBookings()
        {
            var all = await _bookingService.GetAllBookingsAsync();
            var enriched = all.Select(b => new
            {
                booking    = b,
                totalHours = (b.EndTime - b.StartTime).TotalHours,
                totalPrice = b.SportFacility != null
                    ? (double)b.SportFacility.Price * (b.EndTime - b.StartTime).TotalHours
                    : b.Coach != null
                        ? (double)b.Coach.Price * (b.EndTime - b.StartTime).TotalHours
                        : 0
            });
            return Ok(enriched);
        }

        // GET api/booking/mine      ← все авторизованные
        [HttpGet("mine")]
        public async Task<ActionResult<IEnumerable<object>>> GetMyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var bookings = await _bookingService.GetBookingsForUserAsync(userId);
            var enriched = bookings.Select(b => new
            {
                booking    = b,
                totalHours = (b.EndTime - b.StartTime).TotalHours,
                totalPrice = b.SportFacility != null
                    ? (double)b.SportFacility.Price * (b.EndTime - b.StartTime).TotalHours
                    : b.Coach != null
                        ? (double)b.Coach.Price * (b.EndTime - b.StartTime).TotalHours
                        : 0
            });
            return Ok(enriched);
        }

        // POST api/booking/facility
        [HttpPost("facility")]
        public async Task<IActionResult> CreateFacilityBooking([FromBody] Booking model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            model.UserId      = userId;
            model.BookingDate = DateTime.SpecifyKind(model.BookingDate, DateTimeKind.Utc);

            if (string.IsNullOrEmpty(model.SportFacilityId))
                return BadRequest(new { message = "sportFacilityId обязателен" });

            // 1) проверяем, что площадка существует
            var facility = await _facilityService.GetFacilityByIdAsync(model.SportFacilityId);
            if (facility == null)
                return NotFound(new { message = "Площадка не найдена" });

            // 2) проверяем конфликт
            var conflict = await _bookingService.GetBookingByFacilityAndTimeAsync(
                model.SportFacilityId,
                model.BookingDate,
                model.StartTime
            );
            if (conflict != null)
                return Conflict(new { message = "Это время уже занято на этой площадке." });

            // 3) сохраняем и возвращаем вместе с расчётами
            var created = await _bookingService.CreateBookingAsync(model);
            var full    = await _bookingService.GetBookingByIdAsync(created.Id);

            var durationHours = (model.EndTime - model.StartTime).TotalHours;
            var totalPrice    = (double)facility.Price * durationHours;

            return CreatedAtAction(
                nameof(GetBookingById),
                new { id = full!.Id },
                new
                {
                    booking    = full,
                    totalHours = durationHours,
                    totalPrice = totalPrice
                }
            );
        }

        // POST api/booking/coach
        [HttpPost("coach")]
        public async Task<IActionResult> CreateCoachBooking([FromBody] Booking model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            model.UserId      = userId;
            model.BookingDate = DateTime.SpecifyKind(model.BookingDate, DateTimeKind.Utc);

            if (string.IsNullOrEmpty(model.CoachId))
                return BadRequest(new { message = "coachId обязателен" });

            // 1) проверяем, что тренер существует
            var coach = await _coachService.GetCoachByIdAsync(model.CoachId);
            if (coach == null)
                return NotFound(new { message = "Тренер не найден" });

            // 2) проверяем конфликт
            var conflict = await _bookingService.GetBookingByCoachAndTimeAsync(
                model.CoachId,
                model.BookingDate,
                model.StartTime
            );
            if (conflict != null)
                return Conflict(new { message = "Это время уже занято у этого тренера." });

            // 3) сохраняем
            var created = await _bookingService.CreateBookingAsync(model);
            var full    = await _bookingService.GetBookingByIdAsync(created.Id);

            var durationHours = (model.EndTime - model.StartTime).TotalHours;
            var totalPrice    = (double)coach.Price * durationHours;

            return CreatedAtAction(
                nameof(GetBookingById),
                new { id = full!.Id },
                new
                {
                    booking       = full,
                    totalHours    = durationHours,
                    totalPrice    = totalPrice,
                    coachContacts = new
                    {
                        coach.Phone,
                        coach.Telegram,
                        coach.WhatsApp
                    }
                }
            );
        }

        // GET api/booking/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetBookingById(string id)
        {
            var b = await _bookingService.GetBookingByIdAsync(id);
            if (b == null) return NotFound();

            var duration = (b.EndTime - b.StartTime).TotalHours;
            var price    = b.SportFacility != null
                ? (double)b.SportFacility.Price * duration
                : b.Coach != null
                    ? (double)b.Coach.Price * duration
                    : 0;

            return Ok(new
            {
                booking    = b,
                totalHours = duration,
                totalPrice = price
            });
        }

        // PUT api/booking/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Booking>> UpdateBooking(string id, [FromBody] Booking model)
        {
            var updated = await _bookingService.UpdateBookingAsync(id, model);
            return updated == null ? NotFound() : Ok(updated);
        }

        // DELETE api/booking/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(string id)
        {
            var deleted = await _bookingService.DeleteBookingAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
