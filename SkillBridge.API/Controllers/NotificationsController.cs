using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillBridge.API.Data;
using SkillBridge.API.DTOs;

namespace SkillBridge.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly SkillBridgeDbContext _context;

    public NotificationsController(SkillBridgeDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetMyNotifications()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var list = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationDto
            {
                NotificationId = n.NotificationId,
                UserId = n.UserId,
                Title = n.Title,
                Message = n.Message,
                Link = n.Link,
                Type = n.Type,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        return Ok(list);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.NotificationId == id && n.UserId == userId);

        if (notification == null)
        {
            return NotFound(new { message = "Notification not found." });
        }

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var unread = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var n in unread)
        {
            n.IsRead = true;
        }

        await _context.SaveChangesAsync();

        return Ok(new { count = unread.Count });
    }
}
