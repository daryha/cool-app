// Models/Review.cs
using System;

namespace BookingSports.Models
{
    public class Review
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = null!;
        public User? User   { get; set; }

        public string? CoachId { get; set; }
        public Coach?  Coach   { get; set; }

        public string? SportFacilityId { get; set; }
        public SportFacility? SportFacility { get; set; }

        public int    Score   { get; set; }
        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; }  // ← новое поле
    }
}
