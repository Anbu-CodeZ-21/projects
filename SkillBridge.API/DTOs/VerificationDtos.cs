using System.ComponentModel.DataAnnotations;

namespace SkillBridge.API.DTOs;

public class SubmitWorkDto
{
    [Required]
    [Url]
    public string DeliveryUrl { get; set; } = string.Empty;

    [Required]
    [MinLength(10)]
    public string DeliveryNotes { get; set; } = string.Empty;
}

public class VerifyWorkDto
{
    public string? Feedback { get; set; }
    
    // Optional rating when approving
    [Range(1, 5)]
    public int? Rating { get; set; }
    public string? ReviewComment { get; set; }
}

public class RequestRevisionDto
{
    [Required]
    [MinLength(10)]
    public string RevisionNotes { get; set; } = string.Empty;
}

public class WorkSubmissionDto
{
    public int SubmissionId { get; set; }
    public int ProjectId { get; set; }
    public int FreelancerId { get; set; }
    public string DeliveryUrl { get; set; } = string.Empty;
    public string DeliveryNotes { get; set; } = string.Empty;
    public int Version { get; set; }
    public string VerificationStatus { get; set; } = string.Empty; // PendingVerification | Approved | RevisionRequested
    public string? ClientFeedback { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
}
