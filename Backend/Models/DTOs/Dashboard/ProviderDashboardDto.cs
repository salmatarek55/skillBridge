namespace SkillBridge.Models.DTOs.Dashboard
{
    public class ProviderDashboardDto
    {
        public decimal TotalEarnings { get; set; }
        public int ActiveOrdersCount { get; set; }
        public List<ActiveOrderDto> ActiveOrders { get; set; } = new();
    }

    public class ActiveOrderDto
    {
        public int RequestId { get; set; }
        public string ServiceTitle { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public decimal AgreedPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}