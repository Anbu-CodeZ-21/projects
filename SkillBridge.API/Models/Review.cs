namespace SkillBridge.API.Models;

public class Review
{
    public int ReviewId { get; set; }
    public int ProjectId { get; set; }
    public int ClientId { get; set; }
    public int FreelancerId { get; set; }

    public int Rating { get; set; } = 5; // 1 to 5
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public virtual Project Project { get; set; } = null!;
    public virtual User Client { get; set; } = null!;
    public virtual User Freelancer { get; set; } = null!;
}
