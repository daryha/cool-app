// Controllers/CoachController.cs
using BookingSports.Models;
using BookingSports.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BookingSports.Controllers
{
    [Authorize(Roles = "Admin,Coach")]
    [Route("api/coach")]
    [ApiController]
    public class CoachController : ControllerBase
    {
        private readonly ICoachService   _coachSvc;
        private readonly IBookingService _bookingSvc;

        public CoachController(ICoachService coachSvc, IBookingService bookingSvc)
        {
            _coachSvc   = coachSvc;
            _bookingSvc = bookingSvc;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }

        // PUT: api/coach/update
        [HttpPut("update")]
        public async Task<IActionResult> UpdateCoachInfo([FromBody] Coach model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var updated = await _coachSvc.UpdateCoachAsync(userId, model);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // --------------------------
        // Новый метод: экспорт броней
        // GET api/coach/{coachId}/bookings/excel
        [HttpGet("{coachId}/bookings/excel")]
        public async Task<IActionResult> ExportBookingsForCoach(string coachId)
        {
            // Если роль Coach — убедимся, что он запрашивает свои данные
            if (User.IsInRole("Coach"))
            {
                var me = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (me != coachId) return Forbid();
            }

            // 1) проверяем, что тренер существует
            var coach = await _coachSvc.GetCoachByIdAsync(coachId);
            if (coach == null) return NotFound(new { message = "Тренер не найден" });

            // 2) получаем все его брони
            var bookings = (await _bookingSvc.GetBookingsForCoachAsync(coachId))
                               .OrderBy(b => b.BookingDate)
                               .ThenBy(b => b.StartTime)
                               .ToList();

            // 3) собираем excel-пакет
            using var pkg = new ExcelPackage();
            var ws = pkg.Workbook.Worksheets.Add("Bookings");

            // Заголовки
            ws.Cells[1,1].Value = "Кто бронировал";
            ws.Cells[1,2].Value = "Дата";
            ws.Cells[1,3].Value = "Начало";
            ws.Cells[1,4].Value = "Окончание";
            ws.Cells[1,5].Value = "Длительность (ч)";
            ws.Cells[1,6].Value = "Сумма (₸)";

            int row = 2;
            foreach (var b in bookings)
            {
                var duration = (b.EndTime - b.StartTime).TotalHours;
                var totalPrice = (double)coach.Price * duration;

                ws.Cells[row,1].Value = $"{b.User?.FirstName} {b.User?.LastName}";
                ws.Cells[row,2].Value = b.BookingDate.ToString("yyyy-MM-dd");
                ws.Cells[row,3].Value = b.StartTime.ToString(@"hh\:mm");
                ws.Cells[row,4].Value = b.EndTime.ToString(@"hh\:mm");
                ws.Cells[row,5].Value = duration;
                ws.Cells[row,6].Value = totalPrice;
                row++;
            }

            ws.Cells[ws.Dimension.Address].AutoFitColumns();

            // 4) отдаем файл
            var bytes = pkg.GetAsByteArray();
            var filename = $"{coach.FirstName}_{coach.LastName}_bookings.xlsx";
            return File(
                bytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                filename
            );
        }
    }
}
