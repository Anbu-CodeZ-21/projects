using Microsoft.EntityFrameworkCore;
using SkillBridge.API.Models;

namespace SkillBridge.API.Data;

public class SkillBridgeDbContext : DbContext
{
    public SkillBridgeDbContext(DbContextOptions<SkillBridgeDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<FreelancerProfile> FreelancerProfiles => Set<FreelancerProfile>();
    public DbSet<ClientProfile> ClientProfiles => Set<ClientProfile>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<WorkRequest> WorkRequests => Set<WorkRequest>();
    public DbSet<ProjectMilestone> ProjectMilestones => Set<ProjectMilestone>();
    public DbSet<WorkSubmission> WorkSubmissions => Set<WorkSubmission>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User indexes & configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.UserId);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).HasMaxLength(256).IsRequired();
            entity.Property(u => u.FullName).HasMaxLength(150).IsRequired();
            entity.Property(u => u.Role).HasMaxLength(50).IsRequired();
        });

        // User 1-to-1 FreelancerProfile
        modelBuilder.Entity<FreelancerProfile>(entity =>
        {
            entity.HasKey(f => f.FreelancerProfileId);
            entity.HasOne(f => f.User)
                  .WithOne(u => u.FreelancerProfile)
                  .HasForeignKey<FreelancerProfile>(f => f.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Property(f => f.HourlyRate).HasPrecision(18, 2);
            entity.Property(f => f.AverageRating).HasPrecision(3, 2);
            entity.Property(f => f.TotalEarned).HasPrecision(18, 2);
        });

        // User 1-to-1 ClientProfile
        modelBuilder.Entity<ClientProfile>(entity =>
        {
            entity.HasKey(c => c.ClientProfileId);
            entity.HasOne(c => c.User)
                  .WithOne(u => u.ClientProfile)
                  .HasForeignKey<ClientProfile>(c => c.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Property(c => c.TotalSpent).HasPrecision(18, 2);
        });

        // Project configurations
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(p => p.ProjectId);
            entity.Property(p => p.Budget).HasPrecision(18, 2);
            entity.Property(p => p.Status).HasMaxLength(50);
            entity.Property(p => p.Category).HasMaxLength(100);

            entity.HasOne(p => p.Client)
                  .WithMany()
                  .HasForeignKey(p => p.ClientId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(p => p.Freelancer)
                  .WithMany()
                  .HasForeignKey(p => p.FreelancerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // WorkRequest (Proposals)
        modelBuilder.Entity<WorkRequest>(entity =>
        {
            entity.HasKey(w => w.WorkRequestId);
            entity.Property(w => w.Budget).HasPrecision(18, 2);
            entity.Property(w => w.Status).HasMaxLength(50);

            entity.HasOne(w => w.Project)
                  .WithMany(p => p.WorkRequests)
                  .HasForeignKey(w => w.ProjectId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(w => w.Client)
                  .WithMany()
                  .HasForeignKey(w => w.ClientId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(w => w.Freelancer)
                  .WithMany()
                  .HasForeignKey(w => w.FreelancerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ProjectMilestone
        modelBuilder.Entity<ProjectMilestone>(entity =>
        {
            entity.HasKey(m => m.MilestoneId);
            entity.Property(m => m.Amount).HasPrecision(18, 2);
            entity.Property(m => m.Status).HasMaxLength(50);

            entity.HasOne(m => m.Project)
                  .WithMany(p => p.Milestones)
                  .HasForeignKey(m => m.ProjectId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // WorkSubmission
        modelBuilder.Entity<WorkSubmission>(entity =>
        {
            entity.HasKey(s => s.SubmissionId);
            entity.Property(s => s.VerificationStatus).HasMaxLength(50);

            entity.HasOne(s => s.Project)
                  .WithMany(p => p.Submissions)
                  .HasForeignKey(s => s.ProjectId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.Freelancer)
                  .WithMany()
                  .HasForeignKey(s => s.FreelancerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Review
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(r => r.ReviewId);
            entity.HasOne(r => r.Project)
                  .WithMany(p => p.Reviews)
                  .HasForeignKey(r => r.ProjectId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.Client)
                  .WithMany()
                  .HasForeignKey(r => r.ClientId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Freelancer)
                  .WithMany()
                  .HasForeignKey(r => r.FreelancerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Notification
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(n => n.NotificationId);
            entity.Property(n => n.Type).HasMaxLength(50);

            entity.HasOne(n => n.User)
                  .WithMany(u => u.Notifications)
                  .HasForeignKey(n => n.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
