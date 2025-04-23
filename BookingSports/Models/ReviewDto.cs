// Dtos/ReviewDto.cs
using System;

namespace BookingSports.Dtos
{
    public class ReviewDto
    {
        public string    Id           { get; set; } = null!;
        public string    UserId       { get; set; } = null!;
        public string    UserName     { get; set; } = null!;
        public DateTime  CreatedAt    { get; set; }
        public int       Score        { get; set; }
        public string?   Comment      { get; set; }
        public string?   CoachId      { get; set; }
        public string?   CoachName    { get; set; }
        public string?   FacilityId   { get; set; }
        public string?   FacilityName { get; set; }
    }
}
