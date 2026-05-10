using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Services;

namespace SkillBridge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        // ==================== Public Endpoints ====================

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetApprovedServices([FromQuery] ServiceFilterDto filter)
        {
            var services = await _serviceService.GetApprovedServicesAsync(filter);
            return Ok(new
            {
                Success = true,
                Message = "Services retrieved successfully",
                Data = services
            });
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceDetails(int id)
        {
            var service = await _serviceService.GetServiceDetailsAsync(id);

            if (service == null)
                return NotFound(new
                {
                    Success = false,
                    Message = "Service not found"
                });

            return Ok(new
            {
                Success = true,
                Data = service
            });
        }

        // ==================== Provider Endpoints ====================

        [Authorize(Roles = "Provider")]
        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] CreateServiceDto dto)
        {
            var providerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var service = await _serviceService.CreateServiceAsync(providerId, dto);

            return CreatedAtAction(nameof(GetServiceDetails), new { id = service.Id }, new
            {
                Success = true,
                Message = "Service created successfully. Waiting for admin approval.",
                Data = service
            });
        }

        [Authorize(Roles = "Provider")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] UpdateServiceDto dto)
        {
            var providerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var service = await _serviceService.UpdateServiceAsync(providerId, id, dto);

            if (service == null)
                return NotFound(new
                {
                    Success = false,
                    Message = "Service not found or you don't own this service"
                });

            return Ok(new
            {
                Success = true,
                Message = "Service updated successfully. Waiting for admin re-approval.",
                Data = service
            });
        }

        [Authorize(Roles = "Provider")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var providerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _serviceService.DeleteServiceAsync(providerId, id);

            if (!result)
                return NotFound(new
                {
                    Success = false,
                    Message = "Service not found or you don't own this service"
                });

            return Ok(new
            {
                Success = true,
                Message = "Service deleted successfully"
            });
        }

        [Authorize(Roles = "Provider")]
        [HttpGet("my-services")]
        public async Task<IActionResult> GetMyServices()
        {
            var providerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var services = await _serviceService.GetMyServicesAsync(providerId);

            return Ok(new
            {
                Success = true,
                Data = services
            });
        }
    }
}