using System.Security.Cryptography;

namespace SkillBridge.API.Services;

public class PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16; // 128-bit
    private const int KeySize = 32;  // 256-bit
    private const int Iterations = 100_000;
    private static readonly HashAlgorithmName Algorithm = HashAlgorithmName.SHA256;

    public string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, Algorithm, KeySize);

        // Format: {iterations}.{salt_base64}.{hash_base64}
        return $"{Iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(passwordHash)) return false;

        string[] parts = passwordHash.Split('.');
        if (parts.Length != 3) return false;

        if (!int.TryParse(parts[0], out int iterations)) return false;

        byte[] salt = Convert.FromBase64String(parts[1]);
        byte[] hash = Convert.FromBase64String(parts[2]);

        byte[] testHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, Algorithm, hash.Length);

        return CryptographicOperations.FixedTimeEquals(hash, testHash);
    }
}
