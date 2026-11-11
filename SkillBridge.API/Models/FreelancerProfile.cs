namespace SkillBridge.API.Models;

public class FreelancerProfile
{
    public int FreelancerProfileId { get; set; }
    public int UserId { get; set; }
    
    public string ProfessionalTitle { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty; // Comma-separated or JSON list
    public string Experience { get; set; } = "1-3 years";
    public decimal HourlyRate { get; set; } = 800; // in INR (₹)
    public string Location { get; set; } = "Bengaluru, Karnataka";
    public string? PortfolioUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string Availability { get; set; } = "Available"; // Available | Busy | Part-time
    public decimal AverageRating { get; set; } = 5.0m;
    public int ReviewCount { get; set; } = 0;
    public int CompletedProjectsCount { get; set; } = 0;
    public decimal TotalEarned { get; set; } = 0; // in INR (₹)

    // Navigation Properties
    public virtual User User { get; set; } = null!;
}
