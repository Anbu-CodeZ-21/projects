namespace SkillBridge.API.Models;

public class ProjectMilestone
{
    public int MilestoneId { get; set; }
    public int ProjectId { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Amount { get; set; } = 0; // in INR (₹)
    public DateTime? DueDate { get; set; }
    
    // Status: Pending | InProgress | Completed
    public string Status { get; set; } = "Pending";
    public DateTime? CompletedAt { get; set; }

    // Navigation Properties
    public virtual Project Project { get; set; } = null!;
}
