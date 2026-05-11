using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Messages;
using System.Security.Claims;

namespace SkillBridge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // POST /api/Messages
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            var result = await _messageService.SendMessageAsync(GetUserId(), dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // GET /api/Messages/conversation/{requestId}
        [HttpGet("conversation/{requestId}")]
        public async Task<IActionResult> GetConversation(int requestId)
        {
            var result = await _messageService.GetConversationAsync(GetUserId(), requestId);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // GET /api/Messages/unread-count
[HttpGet("unread-count")]
public async Task<IActionResult> GetUnreadCount()
{
    var result = await _messageService.GetUnreadCountAsync(GetUserId());
    return result.Success ? Ok(result) : BadRequest(result);
}
    }
}