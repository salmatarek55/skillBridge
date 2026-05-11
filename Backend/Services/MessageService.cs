using Microsoft.EntityFrameworkCore;
using SkillBridge.Data;
using SkillBridge.Helpers;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Messages;
using SkillBridge.Models.Entities;

namespace SkillBridge.Services
{
    public class MessageService : IMessageService
    {
        private readonly AppDbContext _db;

        public MessageService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ApiResponse<MessageDto>> SendMessageAsync(int senderId, SendMessageDto dto)
        {
            var request = await _db.ServiceRequests
                .FirstOrDefaultAsync(r => r.Id == dto.RequestId &&
                    (r.ClientId == senderId || r.ProviderId == senderId));

            if (request == null)
                return ApiResponse<MessageDto>.Fail("Request not found or unauthorized");

            if (dto.ReceiverId != request.ClientId && dto.ReceiverId != request.ProviderId)
                return ApiResponse<MessageDto>.Fail("Invalid receiver");

            var message = new Message
            {
                RequestId = dto.RequestId,
                SenderId = senderId,
                ReceiverId = dto.ReceiverId,
                MessageText = dto.MessageText
            };

            _db.Messages.Add(message);
            await _db.SaveChangesAsync();

            await _db.Entry(message).Reference(m => m.Sender).LoadAsync();
            await _db.Entry(message).Reference(m => m.Receiver).LoadAsync();

            var result = new MessageDto
            {
                Id = message.Id,
                RequestId = message.RequestId,
                SenderId = message.SenderId,
                SenderName = message.Sender.FullName,
                ReceiverId = message.ReceiverId,
                ReceiverName = message.Receiver.FullName,
                MessageText = message.MessageText,
                IsRead = message.IsRead,
                CreatedAt = message.CreatedAt
            };

            return ApiResponse<MessageDto>.Ok(result);
        }

        public async Task<ApiResponse<List<MessageDto>>> GetConversationAsync(int userId, int requestId)
        {
            var request = await _db.ServiceRequests
                .FirstOrDefaultAsync(r => r.Id == requestId &&
                    (r.ClientId == userId || r.ProviderId == userId));

            if (request == null)
                return ApiResponse<List<MessageDto>>.Fail("Unauthorized");

            var messages = await _db.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.RequestId == requestId)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    RequestId = m.RequestId,
                    SenderId = m.SenderId,
                    SenderName = m.Sender.FullName,
                    ReceiverId = m.ReceiverId,
                    ReceiverName = m.Receiver.FullName,
                    MessageText = m.MessageText,
                    IsRead = m.IsRead,
                    CreatedAt = m.CreatedAt
                }).ToListAsync();

            // Mark as read
            var unread = await _db.Messages
                .Where(m => m.RequestId == requestId && m.ReceiverId == userId && !m.IsRead)
                .ToListAsync();
            unread.ForEach(m => m.IsRead = true);
            await _db.SaveChangesAsync();

            return ApiResponse<List<MessageDto>>.Ok(messages);
        }

        public async Task<ApiResponse<int>> GetUnreadCountAsync(int userId)
{
    var count = await _db.Messages
        .Where(m => m.ReceiverId == userId && !m.IsRead)
        .CountAsync();

    return ApiResponse<int>.Ok(count);
}
    }
}