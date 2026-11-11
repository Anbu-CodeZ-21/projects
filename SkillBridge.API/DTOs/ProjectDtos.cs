using System.ComponentModel.DataAnnotations;

namespace SkillBridge.API.DTOs;

public class CreateProjectDto
{
    [Required]
    [StringLength(200)]
    public string ProjectTitle { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = "Web Development";

    [Required]
    [Range(100, 10000000)]
    public decimal Budget { get; set; } // INR (₹)

    public string Duration { get; set; } = "2-4 weeks";
    public string SkillsRequired { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = "Intermediate";

    [Required]
    public DateTime Deadline { get; set; }
}

public class UpdateProjectDto
{
    public string? ProjectTitle { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public decimal? Budget { get; set; }
    public string? Duration { get; set; }
    public string? SkillsRequired { get; set; }
    public string? ExperienceLevel { get; set; }
    public DateTime? Deadline { get; set; }
    public string? Status { get; set; }
}

public class UpdateProgressDto
{
    [Range(0, 100)]
    public int Progress { get; set; }
    public string? Note { get; set; }
}

public class ProjectDto
{
    public int ProjectId { get; set; }
    public int ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? ClientCompany { get; set; }
    public string? ClientLocation { get; set; }
    
    public int? FreelancerId { get; set; }
    public string? FreelancerName { get; set; }
    public string? FreelancerTitle { get; set; }
    public string? FreelancerAvatar { get; set; }

    public string ProjectTitle { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public string Duration { get; set; } = string.Empty;
    public string SkillsRequired { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime Deadline { get; set; }
    public string Status { get; set; } = string.Empty;
    public int Progress { get; set; }
    
    public string? DeliveryUrl { get; set; }
    public string? DeliveryNotes { get; set; }
    public string? ClientFeedback { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    public int ProposalsCount { get; set; }
    public List<ProjectMilestoneDto> Milestones { get; set; } = new();
    public List<WorkSubmissionDto> Submissions { get; set; } = new();
}

public class ProjectMilestoneDto
{
    public int MilestoneId { get; set; }
    public int ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public DateTime? DueDate { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime? CompletedAt { get; set; }
}
