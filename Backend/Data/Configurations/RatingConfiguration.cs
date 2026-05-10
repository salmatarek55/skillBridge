using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillBridge.Models.Entities;

namespace SkillBridge.API.Data.Configurations
{
    public class RatingConfiguration : IEntityTypeConfiguration<Rating>
    {
        public void Configure(EntityTypeBuilder<Rating> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.RatingValue)
                .IsRequired();

            builder.Property(x => x.ReviewText)
                .HasMaxLength(1000);

            builder.HasIndex(x => x.RequestId)
                .IsUnique();

            builder.HasOne(x => x.Request)
                .WithOne(x => x.Rating)
                .HasForeignKey<Rating>(x => x.RequestId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Service)
                .WithMany(x => x.Ratings)
                .HasForeignKey(x => x.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Client)
                .WithMany(x => x.GivenRatings)
                .HasForeignKey(x => x.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Provider)
                .WithMany(x => x.ReceivedRatings)
                .HasForeignKey(x => x.ProviderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}