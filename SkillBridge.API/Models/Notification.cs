namespace SkillBridge.API.Models;

public class Notification
{
    public int NotificationId { get; set; }
    public int UserId { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Link { get; set; }
    public string Type { get; set; } = "system"; // proposal | verification | milestone | review | system
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public virtual User User { get; set; } = null!;
}
