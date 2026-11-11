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
public class WorkRequestsController : ControllerBase
{
    private readonly SkillBridgeDbContext _context;
    private readonly INotificationService _notificationService;

    public WorkRequestsController(SkillBridgeDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [Authorize(Roles = "Freelancer")]
    [HttpPost]
    public async Task<ActionResult<WorkRequestDto>> SubmitProposal([FromBody] CreateWorkRequestDto dto)
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
            .Include(p => p.Client)
            .FirstOrDefaultAsync(p => p.ProjectId == dto.ProjectId);

        if (project == null)
        {
            return NotFound(new { message = "Project not found." });
        }

        if (project.Status != "Open")
        {
            return BadRequest(new { message = "This project is no longer accepting new proposals." });
        }

        var existing = await _context.WorkRequests
            .FirstOrDefaultAsync(w => w.ProjectId == dto.ProjectId && w.FreelancerId == freelancerId);

        if (existing != null)
        {
            return Conflict(new { message = "You have already submitted a proposal for this project." });
        }

        var proposal = new WorkRequest
        {
            ProjectId = dto.ProjectId,
            ClientId = project.ClientId,
            FreelancerId = freelancerId,
            ProjectTitle = project.ProjectTitle,
            Description = project.Description,
            BidAmount = dto.BidAmount,
            EstimatedDays = dto.EstimatedDays,
            CoverLetter = dto.CoverLetter.Trim(),
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.WorkRequests.Add(proposal);
        await _context.SaveChangesAsync();

        var freelancerUser = await _context.Users.FindAsync(freelancerId);

        // Notify client
        await _notificationService.CreateNotificationAsync(
            project.ClientId,
            "New Proposal Received",
            $"{freelancerUser?.FullName ?? "A freelancer"} submitted a proposal of ₹{dto.BidAmount:N0} for '{project.ProjectTitle}'.",
            "proposal",
            $"/projects/{project.ProjectId}");

        var resultDto = await GetWorkRequestDto(proposal.WorkRequestId);
        return Ok(resultDto);
    }

    [Authorize(Roles = "Freelancer")]
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<WorkRequestDto>>> GetMyProposals()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int freelancerId))
        {
            return Unauthorized();
        }

        var list = await _context.WorkRequests
            .Include(w => w.Project)
            .Include(w => w.Client).ThenInclude(c => c.ClientProfile)
            .Include(w => w.Freelancer).ThenInclude(f => f.FreelancerProfile)
            .Where(w => w.FreelancerId == freelancerId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return Ok(list.Select(MapDto).ToList());
    }

    [Authorize(Roles = "Client")]
    [HttpGet("project/{projectId}")]
    public async Task<ActionResult<IEnumerable<WorkRequestDto>>> GetProjectProposals(int projectId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int clientId))
        {
            return Unauthorized();
        }

        var project = await _context.Projects.FindAsync(projectId);
        if (project == null)
        {
            return NotFound(new { message = "Project not found." });
        }

        if (project.ClientId != clientId)
        {
            return Forbid();
        }

        var list = await _context.WorkRequests
            .Include(w => w.Project)
            .Include(w => w.Client).ThenInclude(c => c.ClientProfile)
            .Include(w => w.Freelancer).ThenInclude(f => f.FreelancerProfile)
            .Where(w => w.ProjectId == projectId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return Ok(list.Select(MapDto).ToList());
    }

    [Authorize(Roles = "Client")]
    [HttpPut("{id}/accept")]
    public async Task<ActionResult<WorkRequestDto>> AcceptProposal(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int clientId))
        {
            return Unauthorized();
        }

        var proposal = await _context.WorkRequests
            .Include(w => w.Project)
            .FirstOrDefaultAsync(w => w.WorkRequestId == id);

        if (proposal == null)
        {
            return NotFound(new { message = "Proposal not found." });
        }

        if (proposal.ClientId != clientId)
        {
            return Forbid();
        }

        var project = proposal.Project;

        // Set proposal status to Accepted
        proposal.Status = "Accepted";

        // Assign freelancer to project and set project status to InProgress
        project.FreelancerId = proposal.FreelancerId;
        project.Status = "InProgress";
        project.StartDate = DateTime.UtcNow;
        project.Budget = proposal.BidAmount; // update agreed budget

        // Reject other pending proposals for this project
        var otherProposals = await _context.WorkRequests
            .Where(w => w.ProjectId == project.ProjectId && w.WorkRequestId != id && w.Status == "Pending")
            .ToListAsync();

        foreach (var other in otherProposals)
        {
            other.Status = "Rejected";
            await _notificationService.CreateNotificationAsync(
                other.FreelancerId,
                "Proposal Not Selected",
                $"Another proposal was accepted for '{project.ProjectTitle}'. Thank you for your interest.",
                "proposal",
                $"/projects/{project.ProjectId}");
        }

        // Notify accepted freelancer
        await _notificationService.CreateNotificationAsync(
            proposal.FreelancerId,
            "Congratulations! Proposal Accepted",
            $"Your proposal of ₹{proposal.BidAmount:N0} for '{project.ProjectTitle}' has been accepted! The project is now active.",
            "proposal",
            $"/projects/{project.ProjectId}");

        await _context.SaveChangesAsync();

        var dto = await GetWorkRequestDto(proposal.WorkRequestId);
        return Ok(dto);
    }

    [Authorize(Roles = "Client")]
    [HttpPut("{id}/reject")]
    public async Task<ActionResult<WorkRequestDto>> RejectProposal(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int clientId))
        {
            return Unauthorized();
        }

        var proposal = await _context.WorkRequests
            .Include(w => w.Project)
            .FirstOrDefaultAsync(w => w.WorkRequestId == id);

        if (proposal == null)
        {
            return NotFound(new { message = "Proposal not found." });
        }

        if (proposal.ClientId != clientId)
        {
            return Forbid();
        }

        proposal.Status = "Rejected";
        await _context.SaveChangesAsync();

        await _notificationService.CreateNotificationAsync(
            proposal.FreelancerId,
            "Proposal Status Update",
            $"Your proposal for '{proposal.Project.ProjectTitle}' was declined.",
            "proposal",
            $"/projects/{proposal.ProjectId}");

        var dto = await GetWorkRequestDto(proposal.WorkRequestId);
        return Ok(dto);
    }

    private async Task<WorkRequestDto?> GetWorkRequestDto(int id)
    {
        var w = await _context.WorkRequests
            .Include(w => w.Project)
            .Include(w => w.Client).ThenInclude(c => c.ClientProfile)
            .Include(w => w.Freelancer).ThenInclude(f => f.FreelancerProfile)
            .FirstOrDefaultAsync(w => w.WorkRequestId == id);

        return w == null ? null : MapDto(w);
    }

    private static WorkRequestDto MapDto(WorkRequest w)
    {
        return new WorkRequestDto
        {
            WorkRequestId = w.WorkRequestId,
            ProjectId = w.ProjectId,
            ProjectTitle = w.Project?.ProjectTitle ?? w.ProjectTitle,
            ProjectCategory = w.Project?.Category ?? "Web Development",
            ProjectBudget = w.Project?.Budget ?? w.Budget,
            ProjectStatus = w.Project?.Status ?? "Open",
            ClientId = w.ClientId,
            ClientName = w.Client?.FullName ?? "Client",
            ClientCompany = w.Client?.ClientProfile?.CompanyName,
            FreelancerId = w.FreelancerId,
            FreelancerName = w.Freelancer?.FullName ?? "Freelancer",
            FreelancerTitle = w.Freelancer?.FreelancerProfile?.ProfessionalTitle,
            FreelancerAvatar = w.Freelancer?.ProfileImage,
            FreelancerRating = w.Freelancer?.FreelancerProfile?.AverageRating ?? 5.0m,
            BidAmount = w.BidAmount,
            EstimatedDays = w.EstimatedDays,
            CoverLetter = w.CoverLetter,
            Status = w.Status,
            CreatedAt = w.CreatedAt
        };
    }
}
