using SkillBridge.API.Data;
using SkillBridge.API.Models;

namespace SkillBridge.API.Services;

public class NotificationService : INotificationService
{
    private readonly SkillBridgeDbContext _context;

    public NotificationService(SkillBridgeDbContext context)
    {
        _context = context;
    }

    public async Task CreateNotificationAsync(int userId, string title, string message, string type = "system", string? link = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            Link = link,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
    }
}
