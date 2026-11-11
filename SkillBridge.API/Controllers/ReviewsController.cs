using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillBridge.API.Data;
using SkillBridge.API.DTOs;
using SkillBridge.API.Models;
using SkillBridge.API.Services;

namespace SkillBridge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly SkillBridgeDbContext _context;
    private readonly INotificationService _notificationService;

    public ReviewsController(SkillBridgeDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [HttpGet("freelancer/{id}")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetFreelancerReviews(int id)
    {
        var reviews = await _context.Reviews
            .Include(r => r.Project)
            .Include(r => r.Client)
            .Where(r => r.FreelancerId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                ReviewId = r.ReviewId,
                ProjectId = r.ProjectId,
                ProjectTitle = r.Project.ProjectTitle,
                ClientId = r.ClientId,
                ClientName = r.Client.FullName,
                ClientAvatar = r.Client.ProfileImage,
                FreelancerId = r.FreelancerId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [Authorize(Roles = "Client")]
    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int clientId))
        {
            return Unauthorized();
        }

        var project = await _context.Projects.FindAsync(dto.ProjectId);
        if (project == null)
        {
            return NotFound(new { message = "Project not found." });
        }

        if (project.ClientId != clientId)
        {
            return Forbid();
        }

        if (project.Status != "Completed")
        {
            return BadRequest(new { message = "Reviews can only be submitted for completed projects." });
        }

        var review = new Review
        {
            ProjectId = dto.ProjectId,
            ClientId = clientId,
            FreelancerId = dto.FreelancerId,
            Rating = dto.Rating,
            Comment = dto.Comment.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);

        // Update freelancer average rating
        var freelancerProfile = await _context.FreelancerProfiles
            .FirstOrDefaultAsync(f => f.UserId == dto.FreelancerId);

        if (freelancerProfile != null)
        {
            var count = freelancerProfile.ReviewCount;
            var total = freelancerProfile.AverageRating * count;
            var newCount = count + 1;
            freelancerProfile.AverageRating = Math.Round((total + dto.Rating) / newCount, 2);
            freelancerProfile.ReviewCount = newCount;
        }

        await _notificationService.CreateNotificationAsync(
            dto.FreelancerId,
            "New Client Review Received",
            $"A client left a {dto.Rating}-star review for your work on '{project.ProjectTitle}'.",
            "review",
            $"/freelancer/{dto.FreelancerId}");

        await _context.SaveChangesAsync();

        var clientUser = await _context.Users.FindAsync(clientId);

        return Ok(new ReviewDto
        {
            ReviewId = review.ReviewId,
            ProjectId = project.ProjectId,
            ProjectTitle = project.ProjectTitle,
            ClientId = clientId,
            ClientName = clientUser?.FullName ?? "Client",
            ClientAvatar = clientUser?.ProfileImage,
            FreelancerId = dto.FreelancerId,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        });
    }
}
