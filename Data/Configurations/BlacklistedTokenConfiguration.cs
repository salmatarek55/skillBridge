using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillBridge.Models.Entities;
public class BlacklistedTokenConfiguration : IEntityTypeConfiguration<BlacklistedToken>
{
    public void Configure(EntityTypeBuilder<BlacklistedToken> builder)
    {
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Token).IsRequired();
        builder.Property(b => b.ExpireAt).IsRequired();
    }
}
