using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Requests;
using System.Security.Claims;

namespace SkillBridge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RequestsController : ControllerBase
    {
        private readonly IRequestService _requestService;

        public RequestsController(IRequestService requestService)
        {
            _requestService = requestService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        private string GetUserRole() =>
            User.FindFirstValue(ClaimTypes.Role)!;

        [HttpPost]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> CreateRequest([FromBody] CreateRequestDto dto)
        {
            var result = await _requestService.CreateRequestAsync(GetUserId(), dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyRequests()
        {
            var result = await _requestService.GetMyRequestsAsync(GetUserId(), GetUserRole());
            return Ok(result);
        }

        // PATCH /api/Requests/{id}/accept — Provider يقبل
        [HttpPatch("{id}/accept")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> AcceptRequest(int id)
        {
            var result = await _requestService.AcceptRequestAsync(GetUserId(), id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // PATCH /api/Requests/{id}/reject — Provider يرفض
        [HttpPatch("{id}/reject")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> RejectRequest(int id)
        {
            var result = await _requestService.RejectRequestAsync(GetUserId(), id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // PATCH /api/Requests/{id}/complete — Provider يكمل
        [HttpPatch("{id}/complete")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> MarkCompleted(int id)
        {
            var result = await _requestService.MarkCompletedAsync(GetUserId(), id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPatch("{id}/cancel")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> CancelRequest(int id)
        {
            var result = await _requestService.CancelRequestAsync(GetUserId(), id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}