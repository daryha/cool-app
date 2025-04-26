// Controllers/AdminFacilityController.cs
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
    [Route("api/admin/facility")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminFacilityController : ControllerBase
    {
        private readonly ISportFacilityService _facilityService;
        private readonly IBookingService       _bookingService;

        public AdminFacilityController(
            ISportFacilityService facilityService,
            IBookingService       bookingService)
        {
            _facilityService = facilityService;
            _bookingService  = bookingService;
        }

        // GET api/admin/facility/{facilityId}/bookings/excel
        [HttpGet("{facilityId}/bookings/excel")]
        public async Task<IActionResult> ExportFacilityBookings(string facilityId)
        {
            // 1) проверяем, что площадка существует
            var facility = await _facilityService.GetFacilityByIdAsync(facilityId);
            if (facility == null)
                return NotFound(new { message = "Facility not found" });

            // 2) получаем бронь по площадке
            var bookings = await _bookingService.GetBookingsForFacilityAsync(facilityId);
            if (!bookings.Any())
                return NotFound(new { message = "No bookings for this facility" });

            // 3) формируем Excel
            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Bookings");

            // Заголовки
            ws.Cell(1, 1).Value = "Клиент";
            ws.Cell(1, 2).Value = "Email";
            ws.Cell(1, 3).Value = "Дата";
            ws.Cell(1, 4).Value = "С";
            ws.Cell(1, 5).Value = "До";
            ws.Cell(1, 6).Value = "Часов";
            ws.Cell(1, 7).Value = "Цена за час";
            ws.Cell(1, 8).Value = "Итого";

            // Данные
            int row = 2;
            foreach (var b in bookings)
            {
                var hours = (b.EndTime - b.StartTime).TotalHours;
                var total = hours * (double)facility.Price;

                ws.Cell(row, 1).Value = $"{b.User?.FirstName} {b.User?.LastName}";
                ws.Cell(row, 2).Value = b.User?.Email;
                ws.Cell(row, 3).Value = b.BookingDate.ToString("yyyy-MM-dd");
                ws.Cell(row, 4).Value = b.StartTime.ToString(@"hh\:mm");
                ws.Cell(row, 5).Value = b.EndTime.ToString(@"hh\:mm");
                ws.Cell(row, 6).Value = hours;
                ws.Cell(row, 7).Value = facility.Price;
                ws.Cell(row, 8).Value = total;
                row++;
            }

            ws.Columns().AdjustToContents();

            // Сохраняем в поток
            using var ms = new MemoryStream();
            wb.SaveAs(ms);

            var fileName = $"Facility_{facility.Name}_{DateTime.UtcNow:yyyyMMdd}.xlsx";
            return File(
                ms.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName
            );
        }
    }
}
