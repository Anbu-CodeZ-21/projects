using System.ComponentModel.DataAnnotations;

namespace SkillBridge.API.DTOs;

public class CreateWorkRequestDto
{
    [Required]
    public int ProjectId { get; set; }

    [Required]
    [Range(100, 10000000)]
    public decimal BidAmount { get; set; } // INR (₹)

    [Required]
    [Range(1, 365)]
    public int EstimatedDays { get; set; }

    [Required]
    [MinLength(20)]
    public string CoverLetter { get; set; } = string.Empty;
}

public class WorkRequestDto
{
    public int WorkRequestId { get; set; }
    public int ProjectId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public string ProjectCategory { get; set; } = string.Empty;
    public decimal ProjectBudget { get; set; }
    public string ProjectStatus { get; set; } = string.Empty;

    public int ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? ClientCompany { get; set; }

    public int FreelancerId { get; set; }
    public string FreelancerName { get; set; } = string.Empty;
    public string? FreelancerTitle { get; set; }
    public string? FreelancerAvatar { get; set; }
    public decimal FreelancerRating { get; set; }

    public decimal BidAmount { get; set; }
    public int EstimatedDays { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Pending | Accepted | Rejected
    public DateTime CreatedAt { get; set; }
}
