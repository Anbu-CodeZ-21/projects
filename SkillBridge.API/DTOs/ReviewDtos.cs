using System.ComponentModel.DataAnnotations;

namespace SkillBridge.API.DTOs;

public class CreateReviewDto
{
    [Required]
    public int ProjectId { get; set; }

    [Required]
    public int FreelancerId { get; set; }

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [MinLength(5)]
    public string Comment { get; set; } = string.Empty;
}

public class ReviewDto
{
    public int ReviewId { get; set; }
    public int ProjectId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public int ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? ClientAvatar { get; set; }
    public int FreelancerId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class NotificationDto
{
    public int NotificationId { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Link { get; set; }
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
