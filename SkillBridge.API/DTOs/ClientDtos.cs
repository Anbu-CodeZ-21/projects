namespace SkillBridge.API.DTOs;

public class ClientProfileDto
{
    public int ClientProfileId { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ProfileImage { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string? CompanyDescription { get; set; }
    public string? Industry { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? Website { get; set; }
    public decimal TotalSpent { get; set; } // INR (₹)
    public bool VerifiedPayment { get; set; }
    public int ProjectsPostedCount { get; set; }
}

public class UpdateClientProfileDto
{
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ProfileImage { get; set; }
    public string? CompanyName { get; set; }
    public string? CompanyDescription { get; set; }
    public string? Industry { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
}
