// Services/BookingService.cs
using BookingSports.Data;
using BookingSports.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingSports.Services
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _db;
        public BookingService(ApplicationDbContext db) => _db = db;

        // Все брони
        public async Task<IEnumerable<Booking>> GetAllBookingsAsync() =>
            await _db.Bookings
                     .Include(b => b.User)
                     .Include(b => b.Coach)
                     .Include(b => b.SportFacility)
                     .ToListAsync();

        // Брони по тренеру
        public async Task<IEnumerable<Booking>> GetBookingsForCoachAsync(string coachId) =>
            await _db.Bookings
                     .Where(b => b.CoachId == coachId)
                     .Include(b => b.User)
                     .Include(b => b.Coach)
                     .Include(b => b.SportFacility)
                     .ToListAsync();

        // Брони по площадке
        public async Task<IEnumerable<Booking>> GetBookingsForFacilityAsync(string facilityId) =>
            await _db.Bookings
                     .Where(b => b.SportFacilityId == facilityId)
                     .Include(b => b.User)
                     .Include(b => b.Coach)
                     .Include(b => b.SportFacility)
                     .ToListAsync();

        // Брони конкретного пользователя
        public async Task<IEnumerable<Booking>> GetBookingsForUserAsync(string userId) =>
            await _db.Bookings
                     .Where(b => b.UserId == userId)
                     .Include(b => b.User)
                     .Include(b => b.Coach)
                     .Include(b => b.SportFacility)
                     .ToListAsync();

        public async Task<Booking?> GetBookingByIdAsync(string id) =>
            await _db.Bookings
                     .Include(b => b.User)
                     .Include(b => b.Coach)
                     .Include(b => b.SportFacility)
                     .FirstOrDefaultAsync(b => b.Id == id);

        public async Task<Booking?> GetBookingByFacilityAndTimeAsync(string? facilityId, DateTime date, TimeSpan startTime)
        {
            if (facilityId == null) return null;
            return await _db.Bookings.FirstOrDefaultAsync(b =>
                b.SportFacilityId == facilityId &&
                b.BookingDate.Date == date.Date &&
                b.StartTime == startTime);
        }

        public async Task<Booking?> GetBookingByCoachAndTimeAsync(string? coachId, DateTime date, TimeSpan startTime)
        {
            if (coachId == null) return null;
            return await _db.Bookings.FirstOrDefaultAsync(b =>
                b.CoachId == coachId &&
                b.BookingDate.Date == date.Date &&
                b.StartTime == startTime);
        }

        public async Task<Booking> CreateBookingAsync(Booking booking)
        {
            _db.Bookings.Add(booking);
            await _db.SaveChangesAsync();
            return booking;
        }

        public async Task<Booking?> UpdateBookingAsync(string id, Booking booking)
        {
            var existing = await _db.Bookings.FindAsync(id);
            if (existing == null) return null;

            existing.UserId          = booking.UserId;
            existing.CoachId         = booking.CoachId;
            existing.SportFacilityId = booking.SportFacilityId;
            existing.BookingDate     = booking.BookingDate;
            existing.StartTime       = booking.StartTime;
            existing.EndTime         = booking.EndTime;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteBookingAsync(string id)
        {
            var existing = await _db.Bookings.FindAsync(id);
            if (existing == null) return false;
            _db.Bookings.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
