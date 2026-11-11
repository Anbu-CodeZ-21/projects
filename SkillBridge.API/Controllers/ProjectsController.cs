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
public class ProjectsController : ControllerBase
{
    private readonly SkillBridgeDbContext _context;
    private readonly INotificationService _notificationService;

    public ProjectsController(SkillBridgeDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? status,
        [FromQuery] decimal? minBudget,
        [FromQuery] decimal? maxBudget,
        [FromQuery] string? experienceLevel,
        [FromQuery] string? duration,
        [FromQuery] string? sortBy)
    {
        var query = _context.Projects
            .Include(p => p.Client)
                .ThenInclude(c => c.ClientProfile)
            .Include(p => p.Freelancer)
                .ThenInclude(f => f!.FreelancerProfile)
            .Include(p => p.WorkRequests)
            .Include(p => p.Milestones)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p =>
                p.ProjectTitle.ToLower().Contains(term) ||
                p.Description.ToLower().Contains(term) ||
                p.SkillsRequired.ToLower().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(p => p.Category.ToLower() == category.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(p => p.Status.ToLower() == status.Trim().ToLower());
        }

        if (minBudget.HasValue)
        {
            query = query.Where(p => p.Budget >= minBudget.Value);
        }

        if (maxBudget.HasValue)
        {
            query = query.Where(p => p.Budget <= maxBudget.Value);
        }

        if (!string.IsNullOrWhiteSpace(experienceLevel))
        {
            query = query.Where(p => p.ExperienceLevel.ToLower() == experienceLevel.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(duration))
        {
            query = query.Where(p => p.Duration.ToLower().Contains(duration.Trim().ToLower()));
        }

        query = sortBy?.ToLower() switch
        {
            "budget_asc" => query.OrderBy(p => p.Budget),
            "budget_desc" => query.OrderByDescending(p => p.Budget),
            "oldest" => query.OrderBy(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var projects = await query.ToListAsync();
        var dtos = projects.Select(MapToProjectDto).ToList();

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDto>> GetProjectById(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Client)
                .ThenInclude(c => c.ClientProfile)
            .Include(p => p.Freelancer)
                .ThenInclude(f => f!.FreelancerProfile)
            .Include(p => p.WorkRequests)
            .Include(p => p.Milestones)
            .Include(p => p.Submissions)
            .FirstOrDefaultAsync(p => p.ProjectId == id);

        if (project == null)
        {
            return NotFound(new { message = "Project not found." });
        }

        return Ok(MapToProjectDto(project));
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetMyProjects()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var query = _context.Projects
            .Include(p => p.Client)
                .ThenInclude(c => c.ClientProfile)
            .Include(p => p.Freelancer)
                .ThenInclude(f => f!.FreelancerProfile)
            .Include(p => p.WorkRequests)
            .Include(p => p.Milestones)
            .Include(p => p.Submissions)
            .AsQueryable();

        if (role == "Client")
        {
            query = query.Where(p => p.ClientId == userId);
        }
        else
        {
            query = query.Where(p => p.FreelancerId == userId);
        }

        var list = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
        return Ok(list.Select(MapToProjectDto).ToList());
    }

    [Authorize(Roles = "Client")]
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject([FromBody] CreateProjectDto dto)
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

        var project = new Project
        {
            ClientId = clientId,
            ProjectTitle = dto.ProjectTitle.Trim(),
            Description = dto.Description.Trim(),
            Category = dto.Category.Trim(),
            Budget = dto.Budget,
            Duration = string.IsNullOrWhiteSpace(dto.Duration) ? "2-4 weeks" : dto.Duration.Trim(),
            SkillsRequired = dto.SkillsRequired?.Trim() ?? string.Empty,
            ExperienceLevel = string.IsNullOrWhiteSpace(dto.ExperienceLevel) ? "Intermediate" : dto.ExperienceLevel.Trim(),
            Deadline = dto.Deadline,
            Status = "Open",
            Progress = 0,
            CreatedAt = DateTime.UtcNow
        };

        // Create standard initial milestones based on budget
        var m1 = new ProjectMilestone
        {
            Title = "Discovery, Planning & Architecture",
            Description = "Initial setup, project kickoff, requirements alignment and wireframing.",
            Amount = Math.Round(dto.Budget * 0.30m, 2),
            DueDate = DateTime.UtcNow.AddDays(7),
            Status = "Pending"
        };
        var m2 = new ProjectMilestone
        {
            Title = "Core Development & Implementation",
            Description = "Main features, design delivery, system integration and functional verification.",
            Amount = Math.Round(dto.Budget * 0.50m, 2),
            DueDate = dto.Deadline.AddDays(-7),
            Status = "Pending"
        };
        var m3 = new ProjectMilestone
        {
            Title = "Final Polish, QA & Delivery Handover",
            Description = "Comprehensive testing, documentation handoff and final review sign-off.",
            Amount = dto.Budget - (m1.Amount + m2.Amount),
            DueDate = dto.Deadline,
            Status = "Pending"
        };

        project.Milestones.Add(m1);
        project.Milestones.Add(m2);
        project.Milestones.Add(m3);

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        // Create notification for client confirmation
        await _notificationService.CreateNotificationAsync(
            clientId,
            "Project Published Successfully",
            $"Your project '{project.ProjectTitle}' with budget ₹{project.Budget:N0} is now live and open for proposals.",
            "system",
            $"/projects/{project.ProjectId}");

        var createdProject = await _context.Projects
            .Include(p => p.Client).ThenInclude(c => c.ClientProfile)
            .Include(p => p.Milestones)
            .FirstAsync(p => p.ProjectId == project.ProjectId);

        return CreatedAtAction(nameof(GetProjectById), new { id = project.ProjectId }, MapToProjectDto(createdProject));
    }

    [Authorize(Roles = "Client")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(int id, [FromBody] UpdateProjectDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int clientId))
        {
            return Unauthorized();
        }

        var project = await _context.Projects
            .Include(p => p.Client).ThenInclude(c => c.ClientProfile)
            .Include(p => p.Freelancer).ThenInclude(f => f!.FreelancerProfile)
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

        if (!string.IsNullOrWhiteSpace(dto.ProjectTitle))
            project.ProjectTitle = dto.ProjectTitle.Trim();

        if (!string.IsNullOrWhiteSpace(dto.Description))
            project.Description = dto.Description.Trim();

        if (!string.IsNullOrWhiteSpace(dto.Category))
            project.Category = dto.Category.Trim();

        if (dto.Budget.HasValue && dto.Budget.Value > 0)
            project.Budget = dto.Budget.Value;

        if (!string.IsNullOrWhiteSpace(dto.Duration))
            project.Duration = dto.Duration.Trim();

        if (dto.SkillsRequired != null)
            project.SkillsRequired = dto.SkillsRequired.Trim();

        if (!string.IsNullOrWhiteSpace(dto.ExperienceLevel))
            project.ExperienceLevel = dto.ExperienceLevel.Trim();

        if (dto.Deadline.HasValue)
            project.Deadline = dto.Deadline.Value;

        if (!string.IsNullOrWhiteSpace(dto.Status))
            project.Status = dto.Status.Trim();

        await _context.SaveChangesAsync();
        return Ok(MapToProjectDto(project));
    }

    [Authorize(Roles = "Freelancer")]
    [HttpPut("{id}/progress")]
    public async Task<ActionResult<ProjectDto>> UpdateProgress(int id, [FromBody] UpdateProgressDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int freelancerId))
        {
            return Unauthorized();
        }

        var project = await _context.Projects
            .Include(p => p.Client).ThenInclude(c => c.ClientProfile)
            .Include(p => p.Freelancer).ThenInclude(f => f!.FreelancerProfile)
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

        project.Progress = Math.Clamp(dto.Progress, 0, 100);

        if (project.Status == "Accepted" && project.Progress > 0)
        {
            project.Status = "InProgress";
        }

        // Notify client of progress update
        await _notificationService.CreateNotificationAsync(
            project.ClientId,
            "Project Progress Updated",
            $"Freelancer updated '{project.ProjectTitle}' progress to {project.Progress}%. {(string.IsNullOrWhiteSpace(dto.Note) ? "" : "Note: " + dto.Note)}",
            "milestone",
            $"/projects/{project.ProjectId}");

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
            ProposalsCount = p.WorkRequests?.Count ?? 0,
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
