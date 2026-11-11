using System.ComponentModel.DataAnnotations;

namespace SkillBridge.API.DTOs;

public class RegisterDto
{
    [Required]
    [StringLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "Freelancer"; // Freelancer | Client

    public string? PhoneNumber { get; set; }
    public string? Location { get; set; }

    // Freelancer specific during register
    public string? ProfessionalTitle { get; set; }
    public string? Skills { get; set; }
    public decimal? HourlyRate { get; set; }

    // Client specific during register
    public string? CompanyName { get; set; }
    public string? Industry { get; set; }
}

public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? ProfileImage { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public FreelancerProfileDto? FreelancerProfile { get; set; }
    public ClientProfileDto? ClientProfile { get; set; }
}
