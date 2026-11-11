namespace SkillBridge.API.Models;

public class Project
{
    public int ProjectId { get; set; }
    public int ClientId { get; set; } // FK to User
    public int? FreelancerId { get; set; } // FK to User (null until proposal accepted)

    public string ProjectTitle { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = "Web Development";
    public decimal Budget { get; set; } = 0; // in INR (₹)
    public string Duration { get; set; } = "2-4 weeks";
    public string SkillsRequired { get; set; } = string.Empty; // Comma-separated
    public string ExperienceLevel { get; set; } = "Intermediate"; // Entry | Intermediate | Expert
    
    public DateTime? StartDate { get; set; }
    public DateTime Deadline { get; set; }
    
    // Status: Open | Accepted | InProgress | Submitted | RevisionRequested | Completed | Cancelled
    public string Status { get; set; } = "Open";
    public int Progress { get; set; } = 0; // 0 to 100%

    // Deliverable fields
    public string? DeliveryUrl { get; set; }
    public string? DeliveryNotes { get; set; }
    public string? ClientFeedback { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    // Navigation Properties
    public virtual User Client { get; set; } = null!;
    public virtual User? Freelancer { get; set; }
    
    public virtual ICollection<ProjectMilestone> Milestones { get; set; } = new List<ProjectMilestone>();
    public virtual ICollection<WorkRequest> WorkRequests { get; set; } = new List<WorkRequest>();
    public virtual ICollection<WorkSubmission> Submissions { get; set; } = new List<WorkSubmission>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
