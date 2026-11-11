namespace SkillBridge.API.Services;

public interface INotificationService
{
    Task CreateNotificationAsync(int userId, string title, string message, string type = "system", string? link = null);
}
