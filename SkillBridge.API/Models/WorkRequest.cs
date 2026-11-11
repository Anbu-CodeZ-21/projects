namespace SkillBridge.API.Models;

public class WorkRequest
{
    public int WorkRequestId { get; set; }
    public int ProjectId { get; set; }
    public int ClientId { get; set; }
    public int FreelancerId { get; set; }

    public string ProjectTitle { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CoverLetter { get; set; } = string.Empty;
    public decimal Budget { get; set; } = 0; // Bid Amount in INR (₹)
    
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public decimal BidAmount { get => Budget; set => Budget = value; }
    public int EstimatedDays { get; set; } = 7;
    public DateTime? Deadline { get; set; }
    
    // Status: Pending | Accepted | Rejected | Withdrawn
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public virtual Project Project { get; set; } = null!;
    public virtual User Client { get; set; } = null!;
    public virtual User Freelancer { get; set; } = null!;
}
