using SkillBridge.API.Models;

namespace SkillBridge.API.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
