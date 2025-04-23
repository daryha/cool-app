// Models/BookingAdminDto.cs
namespace BookingSports.Models
{
    public class BookingAdminDto
    {
        public string Id { get; set; } = null!;
        public DateTime BookingDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public double TotalHours  { get; set; }
        public decimal TotalPrice { get; set; }

        public SimpleUserDto User { get; set; } = null!;
        public SimpleCoachDto? Coach { get; set; }
        public SimpleFacilityDto? SportFacility { get; set; }
    }

    public class SimpleUserDto
    {
        public string Id        { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName  { get; set; } = null!;
        public string City      { get; set; } = null!;
    }

    public class SimpleCoachDto
    {
        public string Id        { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName  { get; set; } = null!;
        public string PhotoUrl  { get; set; } = null!;
        public string Phone     { get; set; } = null!;
        public string Telegram  { get; set; } = null!;
        public string WhatsApp  { get; set; } = null!;
    }

    public class SimpleFacilityDto
    {
        public string Id       { get; set; } = null!;
        public string Name     { get; set; } = null!;
        public string PhotoUrl { get; set; } = null!;
        public string Address  { get; set; } = null!;
        public int    Capacity { get; set; }
    }
}
