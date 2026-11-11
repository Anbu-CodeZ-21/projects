namespace SkillBridge.API.DTOs;

public class FreelancerProfileDto
{
    public int FreelancerProfileId { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ProfileImage { get; set; }
    public string ProfessionalTitle { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; } // INR (₹)
    public string Location { get; set; } = string.Empty;
    public string? PortfolioUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string Availability { get; set; } = "Available";
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public int CompletedProjectsCount { get; set; }
    public decimal TotalEarned { get; set; }
}

public class UpdateFreelancerProfileDto
{
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ProfileImage { get; set; }
    public string? ProfessionalTitle { get; set; }
    public string? Bio { get; set; }
    public string? Skills { get; set; }
    public string? Experience { get; set; }
    public decimal? HourlyRate { get; set; }
    public string? Location { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? Availability { get; set; }
}
