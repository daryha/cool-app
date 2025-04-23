using BookingSports.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingSports.Services
{
    public interface IBookingService
    {
        Task<IEnumerable<Booking>> GetAllBookingsAsync();
        Task<IEnumerable<Booking>> GetBookingsForCoachAsync(string coachId);
        Task<Booking?>            GetBookingByIdAsync(string id);

        // проверка по площадке
        Task<Booking?>            GetBookingByFacilityAndTimeAsync(string? facilityId, DateTime date, TimeSpan startTime);

        // проверка по тренеру
        Task<Booking?>            GetBookingByCoachAndTimeAsync  (string? coachId,    DateTime date, TimeSpan startTime);

        Task<Booking>             CreateBookingAsync(Booking booking);
        Task<Booking?>            UpdateBookingAsync(string id, Booking booking);
        Task<bool>                DeleteBookingAsync(string id);

        // все брони конкретного пользователя
        Task<IEnumerable<Booking>> GetBookingsForUserAsync(string userId);
    }
}
