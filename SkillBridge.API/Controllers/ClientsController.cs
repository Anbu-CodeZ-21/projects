using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillBridge.API.Data;
using SkillBridge.API.DTOs;

namespace SkillBridge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly SkillBridgeDbContext _context;

    public ClientsController(SkillBridgeDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Client")]
    [HttpGet("me")]
    public async Task<ActionResult<ClientProfileDto>> GetMyProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var c = await _context.ClientProfiles
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (c == null)
        {
            return NotFound(new { message = "Client profile not found." });
        }

        var projectCount = await _context.Projects.CountAsync(p => p.ClientId == userId);

        return Ok(new ClientProfileDto
        {
            ClientProfileId = c.ClientProfileId,
            UserId = c.UserId,
            FullName = c.User.FullName,
            Email = c.User.Email,
            ProfileImage = c.User.ProfileImage,
            CompanyName = c.CompanyName,
            CompanyDescription = c.CompanyDescription,
            Industry = c.Industry,
            Location = c.Location,
            Website = c.Website,
            TotalSpent = c.TotalSpent,
            VerifiedPayment = c.VerifiedPayment,
            ProjectsPostedCount = projectCount
        });
    }

    [Authorize(Roles = "Client")]
    [HttpPut("me")]
    public async Task<ActionResult<ClientProfileDto>> UpdateMyProfile([FromBody] UpdateClientProfileDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.ClientProfile)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null || user.ClientProfile == null)
        {
            return NotFound(new { message = "Client profile not found." });
        }

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            user.FullName = dto.FullName.Trim();

        if (dto.PhoneNumber != null)
            user.PhoneNumber = dto.PhoneNumber.Trim();

        if (dto.ProfileImage != null)
            user.ProfileImage = dto.ProfileImage.Trim();

        var profile = user.ClientProfile;
        if (!string.IsNullOrWhiteSpace(dto.CompanyName))
            profile.CompanyName = dto.CompanyName.Trim();

        if (dto.CompanyDescription != null)
            profile.CompanyDescription = dto.CompanyDescription.Trim();

        if (dto.Industry != null)
            profile.Industry = dto.Industry.Trim();

        if (!string.IsNullOrWhiteSpace(dto.Location))
            profile.Location = dto.Location.Trim();

        if (dto.Website != null)
            profile.Website = dto.Website.Trim();

        await _context.SaveChangesAsync();

        var projectCount = await _context.Projects.CountAsync(p => p.ClientId == userId);

        return Ok(new ClientProfileDto
        {
            ClientProfileId = profile.ClientProfileId,
            UserId = user.UserId,
            FullName = user.FullName,
            Email = user.Email,
            ProfileImage = user.ProfileImage,
            CompanyName = profile.CompanyName,
            CompanyDescription = profile.CompanyDescription,
            Industry = profile.Industry,
            Location = profile.Location,
            Website = profile.Website,
            TotalSpent = profile.TotalSpent,
            VerifiedPayment = profile.VerifiedPayment,
            ProjectsPostedCount = projectCount
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClientProfileDto>> GetClientById(int id)
    {
        var c = await _context.ClientProfiles
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.UserId == id || x.ClientProfileId == id);

        if (c == null)
        {
            return NotFound(new { message = "Client profile not found." });
        }

        var projectCount = await _context.Projects.CountAsync(p => p.ClientId == c.UserId);

        return Ok(new ClientProfileDto
        {
            ClientProfileId = c.ClientProfileId,
            UserId = c.UserId,
            FullName = c.User.FullName,
            Email = c.User.Email,
            ProfileImage = c.User.ProfileImage,
            CompanyName = c.CompanyName,
            CompanyDescription = c.CompanyDescription,
            Industry = c.Industry,
            Location = c.Location,
            Website = c.Website,
            TotalSpent = c.TotalSpent,
            VerifiedPayment = c.VerifiedPayment,
            ProjectsPostedCount = projectCount
        });
    }
}
