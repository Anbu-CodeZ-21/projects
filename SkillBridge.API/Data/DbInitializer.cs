using Microsoft.EntityFrameworkCore;
using SkillBridge.API.Models;
using SkillBridge.API.Services;

namespace SkillBridge.API.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(SkillBridgeDbContext context, IPasswordHasher passwordHasher)
    {
        // Ensure database is created
        await context.Database.MigrateAsync();

        // Check if DB already seeded
        if (await context.Users.AnyAsync())
        {
            return; // DB already has data
        }

        var defaultPasswordHash = passwordHasher.HashPassword("password123");

        // 1. Seed Freelancer User
        var freelancerUser = new User
        {
            FullName = "Arjun Sharma",
            Email = "freelancer@skillbridge.in",
            PasswordHash = defaultPasswordHash,
            Role = "Freelancer",
            PhoneNumber = "+91 98765 43210",
            ProfileImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            CreatedAt = DateTime.UtcNow.AddMonths(-6)
        };

        var freelancerUser2 = new User
        {
            FullName = "Rohan Gupta",
            Email = "rohan@skillbridge.in",
            PasswordHash = defaultPasswordHash,
            Role = "Freelancer",
            PhoneNumber = "+91 98220 11223",
            ProfileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
            CreatedAt = DateTime.UtcNow.AddMonths(-4)
        };

        var freelancerUser3 = new User
        {
            FullName = "Ananya Iyer",
            Email = "ananya@skillbridge.in",
            PasswordHash = defaultPasswordHash,
            Role = "Freelancer",
            PhoneNumber = "+91 98111 22334",
            ProfileImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
            CreatedAt = DateTime.UtcNow.AddMonths(-3)
        };

        // 2. Seed Client User
        var clientUser = new User
        {
            FullName = "Priya Nair",
            Email = "client@skillbridge.in",
            PasswordHash = defaultPasswordHash,
            Role = "Client",
            PhoneNumber = "+91 91234 56789",
            ProfileImage = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
            CreatedAt = DateTime.UtcNow.AddMonths(-8)
        };

        var clientUser2 = new User
        {
            FullName = "Vikram Malhotra",
            Email = "vikram@zenithtech.in",
            PasswordHash = defaultPasswordHash,
            Role = "Client",
            PhoneNumber = "+91 99887 66554",
            ProfileImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
            CreatedAt = DateTime.UtcNow.AddMonths(-5)
        };

        context.Users.AddRange(freelancerUser, freelancerUser2, freelancerUser3, clientUser, clientUser2);
        await context.SaveChangesAsync();

        // 3. Seed Freelancer Profiles
        var profile1 = new FreelancerProfile
        {
            UserId = freelancerUser.UserId,
            ProfessionalTitle = "Senior Full-Stack & React Developer",
            Bio = "Passionate full-stack developer with 6+ years of experience building modern web apps using React, ASP.NET Core, and Node.js. Dedicated to pixel-perfect UI and clean, scalable backend architecture.",
            Skills = "React.js, ASP.NET Core, C#, SQL Server, JavaScript, Tailwind CSS, REST APIs",
            Experience = "6+ years",
            HourlyRate = 1500m,
            Location = "Bengaluru, Karnataka",
            PortfolioUrl = "https://github.com/arjun-sharma-dev",
            GithubUrl = "https://github.com/arjunsharma",
            Availability = "Available",
            AverageRating = 4.9m,
            ReviewCount = 24,
            CompletedProjectsCount = 18,
            TotalEarned = 385000m
        };

        var profile2 = new FreelancerProfile
        {
            UserId = freelancerUser2.UserId,
            ProfessionalTitle = "UI/UX & Mobile App Designer",
            Bio = "Figma maestro crafting enterprise UX workflows and accessible modern design systems. Delivering fast interactive prototypes and front-end implementations.",
            Skills = "Figma, UI/UX Design, React Native, Mobile Design, Prototyping, CSS3",
            Experience = "4+ years",
            HourlyRate = 1200m,
            Location = "Pune, Maharashtra",
            PortfolioUrl = "https://dribbble.com/rohangupta",
            GithubUrl = "https://github.com/rohangupta",
            Availability = "Available",
            AverageRating = 4.8m,
            ReviewCount = 16,
            CompletedProjectsCount = 12,
            TotalEarned = 210000m
        };

        var profile3 = new FreelancerProfile
        {
            UserId = freelancerUser3.UserId,
            ProfessionalTitle = "Cloud & Backend Architect",
            Bio = "Specializing in microservices, enterprise C# .NET APIs, SQL Server database performance optimization, and secure enterprise integrations.",
            Skills = "C#, ASP.NET Core Web API, SQL Server, Docker, Azure, Entity Framework Core",
            Experience = "7+ years",
            HourlyRate = 1800m,
            Location = "Hyderabad, Telangana",
            PortfolioUrl = "https://github.com/ananya-iyer",
            GithubUrl = "https://github.com/ananyaiyer",
            Availability = "Part-time",
            AverageRating = 5.0m,
            ReviewCount = 19,
            CompletedProjectsCount = 15,
            TotalEarned = 460000m
        };

        // 4. Seed Client Profiles
        var clientProfile1 = new ClientProfile
        {
            UserId = clientUser.UserId,
            CompanyName = "TechNova Solutions India",
            CompanyDescription = "Leading software technology product consulting firm helping high-growth startups and enterprises scale across India.",
            Industry = "Information Technology & Services",
            Location = "Bengaluru, Karnataka",
            Website = "https://technova.example.com",
            TotalSpent = 420000m,
            VerifiedPayment = true
        };

        var clientProfile2 = new ClientProfile
        {
            UserId = clientUser2.UserId,
            CompanyName = "Zenith Retail Ventures",
            CompanyDescription = "Pan-India direct-to-consumer e-commerce brand operating omnichannel distribution and supply chain fulfillment.",
            Industry = "E-Commerce & Retail",
            Location = "Mumbai, Maharashtra",
            Website = "https://zenithretail.example.com",
            TotalSpent = 280000m,
            VerifiedPayment = true
        };

        context.FreelancerProfiles.AddRange(profile1, profile2, profile3);
        context.ClientProfiles.AddRange(clientProfile1, clientProfile2);
        await context.SaveChangesAsync();

        // 5. Seed Projects with various statuses across the verification workflow
        // Project 1: Submitted for verification (Demonstrates Work Verification workflow)
        var project1 = new Project
        {
            ClientId = clientUser.UserId,
            FreelancerId = freelancerUser.UserId,
            ProjectTitle = "NextGen FinTech Mobile App UI/UX Design",
            Description = "Design a sleek, accessible, intuitive multi-currency financial wallet and payments application for Indian MSMEs. Must include dashboard, KYC onboarding, UPI QR scanning, and transaction history.",
            Category = "UI/UX Design",
            Budget = 45000m,
            Duration = "3 weeks",
            SkillsRequired = "Figma, Mobile Design, UI/UX, Design Systems",
            ExperienceLevel = "Intermediate",
            StartDate = DateTime.UtcNow.AddDays(-14),
            Deadline = DateTime.UtcNow.AddDays(7),
            Status = "Submitted",
            Progress = 100,
            DeliveryUrl = "https://figma.com/file/sample-skillbridge-fintech-preview",
            DeliveryNotes = "Final UI kit, 36 mobile screens, Figma interactive prototype, and design tokens ready for client inspection.",
            CreatedAt = DateTime.UtcNow.AddDays(-15)
        };

        // Project 2: In Progress (Freelancer actively tracking progress)
        var project2 = new Project
        {
            ClientId = clientUser.UserId,
            FreelancerId = freelancerUser.UserId,
            ProjectTitle = "E-Commerce Microservices Migration to ASP.NET Core",
            Description = "Refactor monolithic inventory and order services into clean ASP.NET Core Web API microservices backed by SQL Server with JWT authentication and audit trails.",
            Category = "Web Development",
            Budget = 120000m,
            Duration = "6 weeks",
            SkillsRequired = "ASP.NET Core, C#, SQL Server, REST API, Docker",
            ExperienceLevel = "Expert",
            StartDate = DateTime.UtcNow.AddDays(-20),
            Deadline = DateTime.UtcNow.AddDays(22),
            Status = "InProgress",
            Progress = 65,
            CreatedAt = DateTime.UtcNow.AddDays(-22)
        };

        // Project 3: Open for proposals
        var project3 = new Project
        {
            ClientId = clientUser2.UserId,
            FreelancerId = null,
            ProjectTitle = "Healthcare Patient Portal Frontend in React.js",
            Description = "Build a responsive healthcare consultation dashboard in React with appointment booking, lab report downloads, and doctor tele-consultation UI.",
            Category = "Web Development",
            Budget = 65000m,
            Duration = "4 weeks",
            SkillsRequired = "React.js, Tailwind CSS, REST APIs, JavaScript",
            ExperienceLevel = "Intermediate",
            Deadline = DateTime.UtcNow.AddDays(30),
            Status = "Open",
            Progress = 0,
            CreatedAt = DateTime.UtcNow.AddDays(-5)
        };

        // Project 4: Completed with review
        var project4 = new Project
        {
            ClientId = clientUser.UserId,
            FreelancerId = freelancerUser.UserId,
            ProjectTitle = "Supply Chain Tracking Dashboard & Real-Time Analytics",
            Description = "Built real-time shipment monitoring dashboard with fleet route tracking, SLA alerts, and PDF invoice generation.",
            Category = "Web Development",
            Budget = 85000m,
            Duration = "4 weeks",
            SkillsRequired = "React.js, ASP.NET Core, SQL Server, Chart.js",
            ExperienceLevel = "Expert",
            StartDate = DateTime.UtcNow.AddMonths(-2),
            Deadline = DateTime.UtcNow.AddMonths(-1),
            Status = "Completed",
            Progress = 100,
            DeliveryUrl = "https://github.com/skillbridge/sample-supply-chain",
            DeliveryNotes = "Delivered on schedule with complete unit test suite and Swagger documentation.",
            ClientFeedback = "Exceptional work! Arjun completed every milestone flawlessly and provided great architectural advice.",
            CreatedAt = DateTime.UtcNow.AddMonths(-2),
            CompletedAt = DateTime.UtcNow.AddMonths(-1)
        };

        context.Projects.AddRange(project1, project2, project3, project4);
        await context.SaveChangesAsync();

        // 6. Seed Milestones
        var m1 = new ProjectMilestone
        {
            ProjectId = project1.ProjectId,
            Title = "Wireframes & Information Architecture",
            Description = "Low-fidelity wireframes for core transaction workflows",
            Amount = 15000m,
            DueDate = DateTime.UtcNow.AddDays(-7),
            Status = "Completed",
            CompletedAt = DateTime.UtcNow.AddDays(-7)
        };

        var m2 = new ProjectMilestone
        {
            ProjectId = project1.ProjectId,
            Title = "High-Fidelity UI Screens & Component Library",
            Description = "Color schemes, dark mode tokens, typography system",
            Amount = 15000m,
            DueDate = DateTime.UtcNow.AddDays(-2),
            Status = "Completed",
            CompletedAt = DateTime.UtcNow.AddDays(-2)
        };

        var m3 = new ProjectMilestone
        {
            ProjectId = project1.ProjectId,
            Title = "Clickable Prototype & Developer Handoff",
            Description = "Interactive Figma animations and asset export",
            Amount = 15000m,
            DueDate = DateTime.UtcNow.AddDays(7),
            Status = "InProgress"
        };

        var m4 = new ProjectMilestone
        {
            ProjectId = project2.ProjectId,
            Title = "Database Schema Migration & EF Core Setup",
            Description = "SQL Server tables, migrations, and DTO contracts",
            Amount = 40000m,
            DueDate = DateTime.UtcNow.AddDays(-10),
            Status = "Completed",
            CompletedAt = DateTime.UtcNow.AddDays(-10)
        };

        var m5 = new ProjectMilestone
        {
            ProjectId = project2.ProjectId,
            Title = "Catalog & Inventory API Endpoints",
            Description = "CRUD services, pagination, caching layer",
            Amount = 40000m,
            DueDate = DateTime.UtcNow.AddDays(5),
            Status = "InProgress"
        };

        var m6 = new ProjectMilestone
        {
            ProjectId = project2.ProjectId,
            Title = "Order Processing & Payment Webhooks",
            Description = "Async queues, payment reconciliation, unit tests",
            Amount = 40000m,
            DueDate = DateTime.UtcNow.AddDays(22),
            Status = "Pending"
        };

        context.ProjectMilestones.AddRange(m1, m2, m3, m4, m5, m6);

        // 7. Seed Work Submission for Project 1
        var submission1 = new WorkSubmission
        {
            ProjectId = project1.ProjectId,
            FreelancerId = freelancerUser.UserId,
            DeliveryUrl = "https://figma.com/file/sample-skillbridge-fintech-preview",
            DeliveryNotes = "Final UI kit, 36 mobile screens, Figma interactive prototype, and design tokens ready for client inspection.",
            Version = 1,
            VerificationStatus = "PendingVerification",
            SubmittedAt = DateTime.UtcNow.AddDays(-1)
        };
        context.WorkSubmissions.Add(submission1);

        // 8. Seed Proposals (WorkRequests)
        var prop1 = new WorkRequest
        {
            ProjectId = project1.ProjectId,
            ClientId = clientUser.UserId,
            FreelancerId = freelancerUser.UserId,
            ProjectTitle = project1.ProjectTitle,
            Description = project1.Description,
            BidAmount = 45000m,
            EstimatedDays = 21,
            CoverLetter = "I have built fintech applications for Indian startups and understand UPI workflows, RBI compliance guidelines, and mobile UX benchmarks.",
            Status = "Accepted",
            CreatedAt = DateTime.UtcNow.AddDays(-14)
        };

        var prop2 = new WorkRequest
        {
            ProjectId = project2.ProjectId,
            ClientId = clientUser.UserId,
            FreelancerId = freelancerUser.UserId,
            ProjectTitle = project2.ProjectTitle,
            Description = project2.Description,
            BidAmount = 120000m,
            EstimatedDays = 42,
            CoverLetter = "Senior ASP.NET Core developer with direct experience migrating legacy monoliths to microservices.",
            Status = "Accepted",
            CreatedAt = DateTime.UtcNow.AddDays(-21)
        };

        var prop3 = new WorkRequest
        {
            ProjectId = project3.ProjectId,
            ClientId = clientUser2.UserId,
            FreelancerId = freelancerUser2.UserId,
            ProjectTitle = project3.ProjectTitle,
            Description = project3.Description,
            BidAmount = 60000m,
            EstimatedDays = 25,
            CoverLetter = "Excited to work on the Healthcare portal. I have developed similar HIPAA/ABDM-aligned React dashboards before.",
            Status = "Pending",
            CreatedAt = DateTime.UtcNow.AddDays(-2)
        };

        context.WorkRequests.AddRange(prop1, prop2, prop3);

        // 9. Seed Review for Project 4
        var review1 = new Review
        {
            ProjectId = project4.ProjectId,
            ClientId = clientUser.UserId,
            FreelancerId = freelancerUser.UserId,
            Rating = 5,
            Comment = "Exceptional work! Arjun completed every milestone flawlessly and provided great architectural advice on our SQL Server database indexes.",
            CreatedAt = DateTime.UtcNow.AddMonths(-1)
        };
        context.Reviews.Add(review1);

        // 10. Seed Notifications
        var notif1 = new Notification
        {
            UserId = clientUser.UserId,
            Title = "Work Submitted for Verification",
            Message = "Arjun Sharma submitted deliverables for 'NextGen FinTech Mobile App UI/UX Design'. Please review and verify.",
            Type = "verification",
            Link = $"/work-verification/{project1.ProjectId}",
            IsRead = false,
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        var notif2 = new Notification
        {
            UserId = freelancerUser.UserId,
            Title = "Milestone Approved",
            Message = "Priya Nair approved Milestone 2 for 'NextGen FinTech Mobile App UI/UX Design'.",
            Type = "milestone",
            Link = $"/projects/{project1.ProjectId}",
            IsRead = true,
            CreatedAt = DateTime.UtcNow.AddDays(-2)
        };

        var notif3 = new Notification
        {
            UserId = clientUser2.UserId,
            Title = "New Proposal Received",
            Message = "Rohan Gupta submitted a proposal for 'Healthcare Patient Portal Frontend in React.js'.",
            Type = "proposal",
            Link = $"/projects/{project3.ProjectId}",
            IsRead = false,
            CreatedAt = DateTime.UtcNow.AddDays(-2)
        };

        context.Notifications.AddRange(notif1, notif2, notif3);
        await context.SaveChangesAsync();
    }
}
