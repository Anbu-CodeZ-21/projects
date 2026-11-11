namespace SkillBridge.API.Models;

public class User
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Freelancer"; // Freelancer | Client | Admin
    public string? PhoneNumber { get; set; }
    public string? ProfileImage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    // Navigation Properties
    public virtual FreelancerProfile? FreelancerProfile { get; set; }
    public virtual ClientProfile? ClientProfile { get; set; }
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
