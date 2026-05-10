using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillBridge.Models.Entities;

namespace SkillBridge.API.Data.Configurations
{
    public class ServiceRequestConfiguration : IEntityTypeConfiguration<ServiceRequest>
    {
        public void Configure(EntityTypeBuilder<ServiceRequest> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Message)
                .HasMaxLength(1000);

            builder.Property(x => x.AgreedPrice)
                .HasColumnType("decimal(18,2)");

            builder.HasOne(x => x.Service)
                .WithMany(x => x.Requests)
                .HasForeignKey(x => x.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Client)
                .WithMany(x => x.ClientRequests)
                .HasForeignKey(x => x.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Provider)
                .WithMany(x => x.ProviderRequests)
                .HasForeignKey(x => x.ProviderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}