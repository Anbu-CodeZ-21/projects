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
public class AuthController : ControllerBase
{
    private readonly SkillBridgeDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthController(
        SkillBridgeDbContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail))
        {
            return Conflict(new { message = "An account with this email address already exists." });
        }

        var role = dto.Role.Equals("Client", StringComparison.OrdinalIgnoreCase) ? "Client" : "Freelancer";

        var user = new User
        {
            FullName = dto.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = _passwordHasher.HashPassword(dto.Password),
            Role = role,
            PhoneNumber = dto.PhoneNumber?.Trim(),
            ProfileImage = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        if (role == "Freelancer")
        {
            var freelancerProfile = new FreelancerProfile
            {
                UserId = user.UserId,
                ProfessionalTitle = string.IsNullOrWhiteSpace(dto.ProfessionalTitle) ? "Freelance Specialist" : dto.ProfessionalTitle.Trim(),
                Bio = "Experienced professional delivering quality services on SkillBridge.",
                Skills = string.IsNullOrWhiteSpace(dto.Skills) ? "Web Development, Design" : dto.Skills.Trim(),
                Experience = "1-3 years",
                HourlyRate = dto.HourlyRate ?? 800m,
                Location = string.IsNullOrWhiteSpace(dto.Location) ? "Bengaluru, Karnataka" : dto.Location.Trim(),
                Availability = "Available",
                AverageRating = 5.0m,
                ReviewCount = 0,
                CompletedProjectsCount = 0,
                TotalEarned = 0m
            };
            _context.FreelancerProfiles.Add(freelancerProfile);
        }
        else
        {
            var clientProfile = new ClientProfile
            {
                UserId = user.UserId,
                CompanyName = string.IsNullOrWhiteSpace(dto.CompanyName) ? $"{user.FullName}'s Company" : dto.CompanyName.Trim(),
                CompanyDescription = "Engaged in quality digital solutions.",
                Industry = string.IsNullOrWhiteSpace(dto.Industry) ? "Technology Services" : dto.Industry.Trim(),
                Location = string.IsNullOrWhiteSpace(dto.Location) ? "Bengaluru, Karnataka" : dto.Location.Trim(),
                TotalSpent = 0m,
                VerifiedPayment = true
            };
            _context.ClientProfiles.Add(clientProfile);
        }

        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);

        var userDto = await MapToUserDto(user.UserId);
        return Ok(new AuthResponseDto
        {
            Token = token,
            User = userDto!
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .Include(u => u.FreelancerProfile)
            .Include(u => u.ClientProfile)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null || !_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        if (!user.IsActive)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = "This account is inactive. Please contact support." });
        }

        var token = _tokenService.GenerateToken(user);
        var userDto = await MapToUserDto(user.UserId);

        return Ok(new AuthResponseDto
        {
            Token = token,
            User = userDto!
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var userDto = await MapToUserDto(userId);
        if (userDto == null)
        {
            return NotFound(new { message = "User not found." });
        }

        return Ok(userDto);
    }

    private async Task<UserDto?> MapToUserDto(int userId)
    {
        var user = await _context.Users
            .Include(u => u.FreelancerProfile)
            .Include(u => u.ClientProfile)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null) return null;

        var dto = new UserDto
        {
            UserId = user.UserId,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            PhoneNumber = user.PhoneNumber,
            ProfileImage = user.ProfileImage,
            CreatedAt = user.CreatedAt
        };

        if (user.FreelancerProfile != null)
        {
            dto.FreelancerProfile = new FreelancerProfileDto
            {
                FreelancerProfileId = user.FreelancerProfile.FreelancerProfileId,
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                ProfileImage = user.ProfileImage,
                ProfessionalTitle = user.FreelancerProfile.ProfessionalTitle,
                Bio = user.FreelancerProfile.Bio,
                Skills = user.FreelancerProfile.Skills,
                Experience = user.FreelancerProfile.Experience,
                HourlyRate = user.FreelancerProfile.HourlyRate,
                Location = user.FreelancerProfile.Location,
                PortfolioUrl = user.FreelancerProfile.PortfolioUrl,
                GithubUrl = user.FreelancerProfile.GithubUrl,
                Availability = user.FreelancerProfile.Availability,
                AverageRating = user.FreelancerProfile.AverageRating,
                ReviewCount = user.FreelancerProfile.ReviewCount,
                CompletedProjectsCount = user.FreelancerProfile.CompletedProjectsCount,
                TotalEarned = user.FreelancerProfile.TotalEarned
            };
        }

        if (user.ClientProfile != null)
        {
            var projectCount = await _context.Projects.CountAsync(p => p.ClientId == user.UserId);
            dto.ClientProfile = new ClientProfileDto
            {
                ClientProfileId = user.ClientProfile.ClientProfileId,
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                ProfileImage = user.ProfileImage,
                CompanyName = user.ClientProfile.CompanyName,
                CompanyDescription = user.ClientProfile.CompanyDescription,
                Industry = user.ClientProfile.Industry,
                Location = user.ClientProfile.Location,
                Website = user.ClientProfile.Website,
                TotalSpent = user.ClientProfile.TotalSpent,
                VerifiedPayment = user.ClientProfile.VerifiedPayment,
                ProjectsPostedCount = projectCount
            };
        }

        return dto;
    }
}
