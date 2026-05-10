using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBridge.Helpers;
using SkillBridge.Interfaces;

namespace SkillBridge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("pending-providers")]
        public async Task<IActionResult> GetPendingProviders()
        {
            var providers = await _adminService.GetPendingProvidersAsync();

            var result = providers.Select(x => new
            {
                x.Id,
                x.FullName,
                x.Email,
                Role = x.Role.ToString(),
                Status = x.Status.ToString(),
                x.CreatedAt
            });

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Pending providers fetched successfully",
                Data = result
            });
        }

        [HttpPatch("approve-provider/{id}")]
        public async Task<IActionResult> ApproveProvider(int id)
        {
            var result = await _adminService.ApproveProviderAsync(id);

            if (!result.Success)
            {
                return NotFound(new ApiResponse<string>
                {
                    Success = false,
                    Message = "Provider not found",
                    Data = null
                });
            }

            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Provider approved successfully",
                Data = null
            });
        }

        [HttpPatch("reject-provider/{id}")]
        public async Task<IActionResult> RejectProvider(int id)
        {
            var result = await _adminService.RejectProviderAsync(id);

            if (!result.Success)
            {
                return NotFound(new ApiResponse<string>
                {
                    Success = false,
                    Message = "Provider not found",
                    Data = null
                });
            }

            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Provider rejected successfully",
                Data = null
            });
        }


        // GET /api/Admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await _adminService.GetAllUsersAsync();
            return Ok(result);
        }
        [HttpGet("pending-services")]
        public async Task<IActionResult> GetPendingServices()
        {
            var services = await _adminService.GetPendingServicesAsync();

            var result = services.Select(x => new
            {
                x.serviceId,
                x.Title,
                x.Description,
                x.Category,
                x.Price,
                x.DeliveryTimeInDays,
                Status = x.Status.ToString(),
                ProviderId = x.ProviderId,
                ProviderName = x.Provider.FullName,
                x.CreatedAt
            });

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Pending services fetched successfully",
                Data = result
            });
        }

        [HttpPatch("approve-service/{id}")]
        public async Task<IActionResult> ApproveService(int id)
        {
            var result = await _adminService.ApproveServiceAsync(id);

            if (!result.Success)
            {
                return NotFound(new ApiResponse<string>
                {
                    Success = false,
                    Message = "Service not found",
                    Data = null
                });
            }

            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Service approved successfully",
                Data = null
            });
        }

        [HttpPatch("reject-service/{id}")]
        public async Task<IActionResult> RejectService(int id)
        {
            var result = await _adminService.RejectServiceAsync(id);

            if (!result.Success)
            {
                return NotFound(new ApiResponse<string>
                {
                    Success = false,
                    Message = "Service not found",
                    Data = null
                });
            }

            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Service rejected successfully",
                Data = null
            });
        }
    }
}