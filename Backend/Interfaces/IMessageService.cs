using SkillBridge.Helpers;
using SkillBridge.Models.DTOs.Messages;

namespace SkillBridge.Interfaces
{
    public interface IMessageService
{
    Task<ApiResponse<MessageDto>> SendMessageAsync(int senderId, SendMessageDto dto);
    Task<ApiResponse<List<MessageDto>>> GetConversationAsync(int userId, int requestId);
    Task<ApiResponse<int>> GetUnreadCountAsync(int userId);
   Task<ApiResponse<int>> GetConversationUnreadCountAsync(int userId, int requestId);
}
}
