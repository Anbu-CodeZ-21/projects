using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillBridge.API.Data;
using SkillBridge.API.DTOs;

namespace SkillBridge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FreelancersController : ControllerBase
{
    private readonly SkillBridgeDbContext _context;

    public FreelancersController(SkillBridgeDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FreelancerProfileDto>>> GetFreelancers(
        [FromQuery] string? search,
        [FromQuery] string? skill,
        [FromQuery] string? location,
        [FromQuery] decimal? minRating,
        [FromQuery] decimal? maxHourlyRate,
        [FromQuery] string? sortBy)
    {
        var query = _context.FreelancerProfiles
            .Include(f => f.User)
            .Where(f => f.User.IsActive);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(f =>
                f.User.FullName.ToLower().Contains(term) ||
                f.ProfessionalTitle.ToLower().Contains(term) ||
                f.Skills.ToLower().Contains(term) ||
                f.Bio.ToLower().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(skill))
        {
            var skillTerm = skill.Trim().ToLower();
            query = query.Where(f => f.Skills.ToLower().Contains(skillTerm));
        }

        if (!string.IsNullOrWhiteSpace(location))
        {
            var locTerm = location.Trim().ToLower();
            query = query.Where(f => f.Location.ToLower().Contains(locTerm));
        }

        if (minRating.HasValue)
        {
            query = query.Where(f => f.AverageRating >= minRating.Value);
        }

        if (maxHourlyRate.HasValue)
        {
            query = query.Where(f => f.HourlyRate <= maxHourlyRate.Value);
        }

        query = sortBy?.ToLower() switch
        {
            "hourlyrate_asc" => query.OrderBy(f => f.HourlyRate),
            "hourlyrate_desc" => query.OrderByDescending(f => f.HourlyRate),
            "completed" => query.OrderByDescending(f => f.CompletedProjectsCount),
            _ => query.OrderByDescending(f => f.AverageRating).ThenByDescending(f => f.ReviewCount)
        };

        var list = await query.Select(f => new FreelancerProfileDto
        {
            FreelancerProfileId = f.FreelancerProfileId,
            UserId = f.UserId,
            FullName = f.User.FullName,
            Email = f.User.Email,
            ProfileImage = f.User.ProfileImage,
            ProfessionalTitle = f.ProfessionalTitle,
            Bio = f.Bio,
            Skills = f.Skills,
            Experience = f.Experience,
            HourlyRate = f.HourlyRate,
            Location = f.Location,
            PortfolioUrl = f.PortfolioUrl,
            GithubUrl = f.GithubUrl,
            Availability = f.Availability,
            AverageRating = f.AverageRating,
            ReviewCount = f.ReviewCount,
            CompletedProjectsCount = f.CompletedProjectsCount,
            TotalEarned = f.TotalEarned
        }).ToListAsync();

        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FreelancerProfileDto>> GetFreelancerById(int id)
    {
        var f = await _context.FreelancerProfiles
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.UserId == id || x.FreelancerProfileId == id);

        if (f == null)
        {
            return NotFound(new { message = "Freelancer profile not found." });
        }

        var dto = new FreelancerProfileDto
        {
            FreelancerProfileId = f.FreelancerProfileId,
            UserId = f.UserId,
            FullName = f.User.FullName,
            Email = f.User.Email,
            ProfileImage = f.User.ProfileImage,
            ProfessionalTitle = f.ProfessionalTitle,
            Bio = f.Bio,
            Skills = f.Skills,
            Experience = f.Experience,
            HourlyRate = f.HourlyRate,
            Location = f.Location,
            PortfolioUrl = f.PortfolioUrl,
            GithubUrl = f.GithubUrl,
            Availability = f.Availability,
            AverageRating = f.AverageRating,
            ReviewCount = f.ReviewCount,
            CompletedProjectsCount = f.CompletedProjectsCount,
            TotalEarned = f.TotalEarned
        };

        return Ok(dto);
    }

    [Authorize(Roles = "Freelancer")]
    [HttpGet("me")]
    public async Task<ActionResult<FreelancerProfileDto>> GetMyProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var f = await _context.FreelancerProfiles
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (f == null)
        {
            return NotFound(new { message = "Freelancer profile not found." });
        }

        return Ok(new FreelancerProfileDto
        {
            FreelancerProfileId = f.FreelancerProfileId,
            UserId = f.UserId,
            FullName = f.User.FullName,
            Email = f.User.Email,
            ProfileImage = f.User.ProfileImage,
            ProfessionalTitle = f.ProfessionalTitle,
            Bio = f.Bio,
            Skills = f.Skills,
            Experience = f.Experience,
            HourlyRate = f.HourlyRate,
            Location = f.Location,
            PortfolioUrl = f.PortfolioUrl,
            GithubUrl = f.GithubUrl,
            Availability = f.Availability,
            AverageRating = f.AverageRating,
            ReviewCount = f.ReviewCount,
            CompletedProjectsCount = f.CompletedProjectsCount,
            TotalEarned = f.TotalEarned
        });
    }

    [Authorize(Roles = "Freelancer")]
    [HttpPut("me")]
    public async Task<ActionResult<FreelancerProfileDto>> UpdateMyProfile([FromBody] UpdateFreelancerProfileDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.FreelancerProfile)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null || user.FreelancerProfile == null)
        {
            return NotFound(new { message = "Profile not found." });
        }

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            user.FullName = dto.FullName.Trim();

        if (dto.PhoneNumber != null)
            user.PhoneNumber = dto.PhoneNumber.Trim();

        if (dto.ProfileImage != null)
            user.ProfileImage = dto.ProfileImage.Trim();

        var profile = user.FreelancerProfile;
        if (!string.IsNullOrWhiteSpace(dto.ProfessionalTitle))
            profile.ProfessionalTitle = dto.ProfessionalTitle.Trim();

        if (dto.Bio != null)
            profile.Bio = dto.Bio.Trim();

        if (dto.Skills != null)
            profile.Skills = dto.Skills.Trim();

        if (!string.IsNullOrWhiteSpace(dto.Experience))
            profile.Experience = dto.Experience.Trim();

        if (dto.HourlyRate.HasValue && dto.HourlyRate.Value > 0)
            profile.HourlyRate = dto.HourlyRate.Value;

        if (!string.IsNullOrWhiteSpace(dto.Location))
            profile.Location = dto.Location.Trim();

        if (dto.PortfolioUrl != null)
            profile.PortfolioUrl = dto.PortfolioUrl.Trim();

        if (dto.GithubUrl != null)
            profile.GithubUrl = dto.GithubUrl.Trim();

        if (!string.IsNullOrWhiteSpace(dto.Availability))
            profile.Availability = dto.Availability.Trim();

        await _context.SaveChangesAsync();

        return Ok(new FreelancerProfileDto
        {
            FreelancerProfileId = profile.FreelancerProfileId,
            UserId = user.UserId,
            FullName = user.FullName,
            Email = user.Email,
            ProfileImage = user.ProfileImage,
            ProfessionalTitle = profile.ProfessionalTitle,
            Bio = profile.Bio,
            Skills = profile.Skills,
            Experience = profile.Experience,
            HourlyRate = profile.HourlyRate,
            Location = profile.Location,
            PortfolioUrl = profile.PortfolioUrl,
            GithubUrl = profile.GithubUrl,
            Availability = profile.Availability,
            AverageRating = profile.AverageRating,
            ReviewCount = profile.ReviewCount,
            CompletedProjectsCount = profile.CompletedProjectsCount,
            TotalEarned = profile.TotalEarned
        });
    }
}
