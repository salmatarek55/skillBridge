using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Messages;
using System.Security.Claims;

namespace SkillBridge.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IMessageService _messageService;

        public ChatHub(IMessageService messageService)
        {
            _messageService = messageService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

            await base.OnConnectedAsync();
        }

        public async Task JoinConversation(int requestId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"request_{requestId}");
        }

        public async Task SendMessage(int requestId, string messageText)
        {
            var senderIdStr = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(senderIdStr)) return;

            var senderId = int.Parse(senderIdStr);
            var senderName = Context.User?.FindFirstValue(ClaimTypes.Name) ?? "Unknown";

            var messageDto = new SendMessageDto 
            { 
                RequestId = requestId, 
                MessageText = messageText 
            };
            await _messageService.SendMessageAsync(senderId, messageDto);

            await Clients.Group($"request_{requestId}").SendAsync("ReceiveMessage", new
            {
                SenderId = senderId,
                SenderName = senderName,
                MessageText = messageText,
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}