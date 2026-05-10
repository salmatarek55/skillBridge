using Microsoft.AspNetCore.Http;

namespace SkillBridge.Helpers
{
    public static class FileUploadHelper
    {
        private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB

        public static async Task<string> UploadImageAsync(IFormFile file, string folder)
        {
            // Validate extension
            var extension = System.IO.Path.GetExtension(file.FileName).ToLower();
            if (!AllowedImageExtensions.Contains(extension))
                throw new Exception("Invalid file type. Only jpg, jpeg, png, webp are allowed.");

            // Validate size
            if (file.Length > MaxFileSizeBytes)
                throw new Exception("File size exceeds 5MB limit.");

            // Create folder if not exists
            var uploadPath = System.IO.Path.Combine("wwwroot", "uploads", folder);
            System.IO.Directory.CreateDirectory(uploadPath);

            // Generate unique filename
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = System.IO.Path.Combine(uploadPath, fileName);

            // Save file
            using var stream = new System.IO.FileStream(filePath, System.IO.FileMode.Create);
            await file.CopyToAsync(stream);

            // Return relative URL
            return $"/uploads/{folder}/{fileName}";
        }

        public static void DeleteImage(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return;

            var filePath = System.IO.Path.Combine("wwwroot", imageUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);
        }
    }
}