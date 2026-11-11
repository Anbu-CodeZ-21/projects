namespace SkillBridge.API.Models;

public class ClientProfile
{
    public int ClientProfileId { get; set; }
    public int UserId { get; set; }

    public string CompanyName { get; set; } = string.Empty;
    public string? CompanyDescription { get; set; }
    public string? Industry { get; set; }
    public string Location { get; set; } = "Mumbai, Maharashtra";
    public string? Website { get; set; }
    public decimal TotalSpent { get; set; } = 0; // in INR (₹)
    public bool VerifiedPayment { get; set; } = true;

    // Navigation Properties
    public virtual User User { get; set; } = null!;
}
