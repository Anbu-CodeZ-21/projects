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
[Route("api/projects/{id}")]
public class VerificationController : ControllerBase
{
    private readonly SkillBridgeDbContext _context;
    private readonly INotificationService _notificationService;

    public VerificationController(SkillBridgeDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [Authorize(Roles = "Freelancer")]
    [HttpPost("submit")]
    public async Task<ActionResult<ProjectDto>> SubmitWork(int id, [FromBody] SubmitWorkDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int freelancerId))
        {
            return Unauthorized();
        }

        var project = await _context.Projects
            .Include(p => p.Client).ThenInclude(c => c.ClientProfile)
            .Include(p => p.Freelancer).ThenInclude(f => f!.FreelancerProfile)
            .Include(p => p.Submissions)
            .Include(p => p.Milestones)
            .FirstOrDefaultAsync(p => p.ProjectId == id);

        if (project == null)
        {
            return NotFound(new { message = "Project not found." });
        }

        if (project.FreelancerId != freelancerId)
        {
            return Forbid();
        }

        if (project.Status != "InProgress" && project.Status != "Accepted" && project.Status != "RevisionRequested")
        {
            return BadRequest(new { message = $"Cannot submit work when project status is '{project.Status}'." });
        }

        var nextVersion = (project.Submissions.Any() ? project.Submissions.Max(s => s.Version) : 0) + 1;

        var submission = new WorkSubmission
        {
            ProjectId = project.ProjectId,
            FreelancerId = freelancerId,
            DeliveryUrl = dto.DeliveryUrl.Trim(),
            DeliveryNotes = dto.DeliveryNotes.Trim(),
            Version = nextVersion,
            VerificationStatus = "PendingVerification",
            SubmittedAt = DateTime.UtcNow
        };

        _context.WorkSubmissions.Add(submission);

        project.Status = "Submitted";
        project.Progress = 100;
        project.DeliveryUrl = dto.DeliveryUrl.Trim();
        project.DeliveryNotes = dto.DeliveryNotes.Trim();
        project.ClientFeedback = null; // Clear previous revision feedback

        await _notificationService.CreateNotificationAsync(
            project.ClientId,
            "Deliverables Submitted for Verification",
            $"{project.Freelancer?.FullName ?? "Freelancer"} submitted version {nextVersion} of deliverables for '{project.ProjectTitle}'. Please review and verify.",
            "verification",
            $"/work-verification/{project.ProjectId}");

        await _context.SaveChangesAsync();

        return Ok(MapToProjectDto(project));
    }

    [Authorize(Roles = "Client")]
    [HttpPost("verify")]
    public async Task<ActionResult<ProjectDto>> VerifyAndApprove(int id, [FromBody] VerifyWorkDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int clientId))
        {
            return Unauthorized();
        }

        var project = await _context.Projects
            .Include(p => p.Client).ThenInclude(c => c.ClientProfile)
            .Include(p => p.Freelancer).ThenInclude(f => f!.FreelancerProfile)
            .Include(p => p.Submissions)
            .Include(p => p.Milestones)
            .FirstOrDefaultAsync(p => p.ProjectId == id);

        if (project == null)
        {
            return NotFound(new { message = "Project not found." });
        }

        if (project.ClientId != clientId)
        {
            return Forbid();
        }

        if (project.Status != "Submitted")
        {
            return BadRequest(new { message = "Only submitted projects can be approved." });
        }

        // Update latest submission
        var latestSubmission = project.Submissions
            .OrderByDescending(s => s.Version)
            .FirstOrDefault();

        if (latestSubmission != null)
        {
            latestSubmission.VerificationStatus = "Approved";
            latestSubmission.ReviewedAt = DateTime.UtcNow;
            latestSubmission.ClientFeedback = dto.Feedback?.Trim() ?? "Work verified and approved.";
        }

        // Complete project
        project.Status = "Completed";
        project.Progress = 100;
        project.CompletedAt = DateTime.UtcNow;
        project.ClientFeedback = dto.Feedback?.Trim() ?? "Work verified and approved.";

        // Complete all milestones
        foreach (var milestone in project.Milestones)
        {
            milestone.Status = "Completed";
            milestone.CompletedAt = DateTime.UtcNow;
        }

        // Update financial stats
        if (project.FreelancerId.HasValue)
        {
            var freelancerProfile = await _context.FreelancerProfiles
                .FirstOrDefaultAsync(f => f.UserId == project.FreelancerId.Value);

            if (freelancerProfile != null)
            {
                freelancerProfile.TotalEarned += project.Budget;
                freelancerProfile.CompletedProjectsCount += 1;

                // Handle review rating if provided
                if (dto.Rating.HasValue && dto.Rating.Value >= 1 && dto.Rating.Value <= 5)
                {
                    var review = new Review
                    {
                        ProjectId = project.ProjectId,
                        ClientId = clientId,
                        FreelancerId = project.FreelancerId.Value,
                        Rating = dto.Rating.Value,
                        Comment = string.IsNullOrWhiteSpace(dto.ReviewComment) ? "Work completed satisfactorily." : dto.ReviewComment.Trim(),
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Reviews.Add(review);

                    // Recalculate average rating
                    var currentReviewsCount = freelancerProfile.ReviewCount;
                    var currentTotalRating = freelancerProfile.AverageRating * currentReviewsCount;
                    var newReviewsCount = currentReviewsCount + 1;
                    var newAvg = Math.Round((currentTotalRating + dto.Rating.Value) / newReviewsCount, 2);

                    freelancerProfile.AverageRating = newAvg;
                    freelancerProfile.ReviewCount = newReviewsCount;
                }
            }

            var clientProfile = await _context.ClientProfiles
                .FirstOrDefaultAsync(c => c.UserId == clientId);

            if (clientProfile != null)
            {
                clientProfile.TotalSpent += project.Budget;
            }

            // Notify freelancer
            await _notificationService.CreateNotificationAsync(
                project.FreelancerId.Value,
                "Work Verified & Payment Released!",
                $"Congratulations! {project.Client?.FullName ?? "The client"} approved your deliverables for '{project.ProjectTitle}'. ₹{project.Budget:N0} has been credited.",
                "verification",
                $"/projects/{project.ProjectId}");
        }

        await _context.SaveChangesAsync();

        return Ok(MapToProjectDto(project));
    }

    [Authorize(Roles = "Client")]
    [HttpPost("request-revision")]
    public async Task<ActionResult<ProjectDto>> RequestRevision(int id, [FromBody] RequestRevisionDto dto)
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

        var project = await _context.Projects
            .Include(p => p.Client).ThenInclude(c => c.ClientProfile)
            .Include(p => p.Freelancer).ThenInclude(f => f!.FreelancerProfile)
            .Include(p => p.Submissions)
            .Include(p => p.Milestones)
            .FirstOrDefaultAsync(p => p.ProjectId == id);

        if (project == null)
        {
            return NotFound(new { message = "Project not found." });
        }

        if (project.ClientId != clientId)
        {
            return Forbid();
        }

        if (project.Status != "Submitted")
        {
            return BadRequest(new { message = "Revisions can only be requested on submitted work." });
        }

        var latestSubmission = project.Submissions
            .OrderByDescending(s => s.Version)
            .FirstOrDefault();

        if (latestSubmission != null)
        {
            latestSubmission.VerificationStatus = "RevisionRequested";
            latestSubmission.ReviewedAt = DateTime.UtcNow;
            latestSubmission.ClientFeedback = dto.RevisionNotes.Trim();
        }

        project.Status = "RevisionRequested";
        project.ClientFeedback = dto.RevisionNotes.Trim();

        if (project.FreelancerId.HasValue)
        {
            await _notificationService.CreateNotificationAsync(
                project.FreelancerId.Value,
                "Revision Requested on Project Deliverables",
                $"Client requested revisions on '{project.ProjectTitle}'. Feedback: {dto.RevisionNotes.Trim()}",
                "verification",
                $"/work-verification/{project.ProjectId}");
        }

        await _context.SaveChangesAsync();

        return Ok(MapToProjectDto(project));
    }

    private static ProjectDto MapToProjectDto(Project p)
    {
        return new ProjectDto
        {
            ProjectId = p.ProjectId,
            ClientId = p.ClientId,
            ClientName = p.Client?.FullName ?? "Client",
            ClientCompany = p.Client?.ClientProfile?.CompanyName,
            ClientLocation = p.Client?.ClientProfile?.Location,
            FreelancerId = p.FreelancerId,
            FreelancerName = p.Freelancer?.FullName,
            FreelancerTitle = p.Freelancer?.FreelancerProfile?.ProfessionalTitle,
            FreelancerAvatar = p.Freelancer?.ProfileImage,
            ProjectTitle = p.ProjectTitle,
            Description = p.Description,
            Category = p.Category,
            Budget = p.Budget,
            Duration = p.Duration,
            SkillsRequired = p.SkillsRequired,
            ExperienceLevel = p.ExperienceLevel,
            StartDate = p.StartDate,
            Deadline = p.Deadline,
            Status = p.Status,
            Progress = p.Progress,
            DeliveryUrl = p.DeliveryUrl,
            DeliveryNotes = p.DeliveryNotes,
            ClientFeedback = p.ClientFeedback,
            CreatedAt = p.CreatedAt,
            CompletedAt = p.CompletedAt,
            Milestones = p.Milestones.Select(m => new ProjectMilestoneDto
            {
                MilestoneId = m.MilestoneId,
                ProjectId = m.ProjectId,
                Title = m.Title,
                Description = m.Description,
                Amount = m.Amount,
                DueDate = m.DueDate,
                Status = m.Status,
                CompletedAt = m.CompletedAt
            }).ToList(),
            Submissions = p.Submissions.Select(s => new WorkSubmissionDto
            {
                SubmissionId = s.SubmissionId,
                ProjectId = s.ProjectId,
                FreelancerId = s.FreelancerId,
                DeliveryUrl = s.DeliveryUrl,
                DeliveryNotes = s.DeliveryNotes,
                Version = s.Version,
                VerificationStatus = s.VerificationStatus,
                ClientFeedback = s.ClientFeedback,
                SubmittedAt = s.SubmittedAt,
                ReviewedAt = s.ReviewedAt
            }).OrderByDescending(s => s.Version).ToList()
        };
    }
}
