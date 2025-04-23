// Models/Booking.cs
using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BookingSports.Models
{
    public class Booking
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [BindNever]
        public string UserId { get; set; } = null!;
        public User? User { get; set; }

        public string? CoachId { get; set; }
        public Coach? Coach { get; set; }

        public string? SportFacilityId { get; set; }
        public SportFacility? SportFacility { get; set; }

        public DateTime BookingDate { get; set; }
        public TimeSpan StartTime  { get; set; }
        public TimeSpan EndTime    { get; set; }
    }
}
