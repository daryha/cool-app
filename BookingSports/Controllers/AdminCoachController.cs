// Controllers/AdminCoachController.cs
using BookingSports.Services;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BookingSports.Controllers
{
    [Route("api/admin/coach")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminCoachController : ControllerBase
    {
        private readonly ICoachService   _coachService;
        private readonly IBookingService _bookingService;

        public AdminCoachController(
            ICoachService   coachService,
            IBookingService bookingService)
        {
            _coachService   = coachService;
            _bookingService = bookingService;
        }

        // GET api/admin/coach/{coachId}/bookings/excel
        [HttpGet("{coachId}/bookings/excel")]
        public async Task<IActionResult> ExportCoachBookings(string coachId)
        {
            var coach = await _coachService.GetCoachByIdAsync(coachId);
            if (coach == null)
                return NotFound(new { message = "Coach not found" });

            var bookings = await _bookingService.GetBookingsForCoachAsync(coachId);
            if (!bookings.Any())
                return NotFound(new { message = "No bookings for this coach" });

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Bookings");

            // 1) Заголовки
            ws.Cell(1, 1).Value = "Клиент";
            ws.Cell(1, 2).Value = "Email";
            ws.Cell(1, 3).Value = "Дата";
            ws.Cell(1, 4).Value = "С";
            ws.Cell(1, 5).Value = "До";
            ws.Cell(1, 6).Value = "Часов";
            ws.Cell(1, 7).Value = "Цена за час";
            ws.Cell(1, 8).Value = "Итого";

            // 2) Заполняем строки
            var row = 2;
            foreach (var b in bookings)
            {
                var hours = (b.EndTime - b.StartTime).TotalHours;
                var total = hours * (double)coach.Price;

                ws.Cell(row, 1).Value = $"{b.User?.FirstName} {b.User?.LastName}";
                ws.Cell(row, 2).Value = b.User?.Email;
                ws.Cell(row, 3).Value = b.BookingDate.ToString("yyyy‑MM‑dd");
                ws.Cell(row, 4).Value = b.StartTime.ToString(@"hh\:mm");
                ws.Cell(row, 5).Value = b.EndTime.ToString(@"hh\:mm");
                ws.Cell(row, 6).Value = hours;
                ws.Cell(row, 7).Value = coach.Price;
                ws.Cell(row, 8).Value = total;
                row++;
            }

            ws.Columns().AdjustToContents();

            // 3) Сохраняем в память и возвращаем
            using var ms = new MemoryStream();
            wb.SaveAs(ms);

            var fileName = $"Coach_{coach.LastName}_{DateTime.UtcNow:yyyyMMdd}.xlsx";
            return File(
                ms.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName
            );
        }
    }
}
