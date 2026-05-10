using System.Security.Cryptography;

namespace SkillBridge.Helpers
{
    public static class PasswordHasher
    {
        public static string Hash(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(16);
            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100000, HashAlgorithmName.SHA256, 32);

            var result = new byte[48];
            Buffer.BlockCopy(salt, 0, result, 0, 16);
            Buffer.BlockCopy(hash, 0, result, 16, 32);

            return Convert.ToBase64String(result);
        }

        public static bool Verify(string password, string hashedPassword)
        {
            var decoded = Convert.FromBase64String(hashedPassword);

            byte[] salt = new byte[16];
            Buffer.BlockCopy(decoded, 0, salt, 0, 16);

            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100000, HashAlgorithmName.SHA256, 32);

            for (int i = 0; i < 32; i++)
            {
                if (decoded[i + 16] != hash[i])
                    return false;
            }

            return true;
        }
    }
}