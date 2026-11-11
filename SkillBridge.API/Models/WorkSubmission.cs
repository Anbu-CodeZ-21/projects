namespace SkillBridge.API.Models;

public class WorkSubmission
{
    public int SubmissionId { get; set; }
    public int ProjectId { get; set; }
    public int FreelancerId { get; set; }

    public string DeliveryUrl { get; set; } = string.Empty;
    public string DeliveryNotes { get; set; } = string.Empty;
    public int Version { get; set; } = 1;
    
    // Status: PendingVerification | Approved | RevisionRequested
    public string VerificationStatus { get; set; } = "PendingVerification";
    public string? ClientFeedback { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }

    // Navigation Properties
    public virtual Project Project { get; set; } = null!;
    public virtual User Freelancer { get; set; } = null!;
}
