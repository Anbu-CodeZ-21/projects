using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using SkillBridge.API.Data;
using SkillBridge.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers with JSON formatting options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Configure Database Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=.\\SQLEXPRESS;Database=SkillBridgeDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;";

builder.Services.AddDbContext<SkillBridgeDbContext>(options =>
    options.UseSqlServer(connectionString));

// Register Application Services
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Configure CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                     ?? new[] { "http://localhost:5173", "http://127.0.0.1:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("SkillBridgeCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SkillBridge_SuperSecret_Jwt_Security_Key_2026_Secure_Token_Hashing!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "SkillBridgeAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "SkillBridgeClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Configure Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SkillBridge Web API",
        Version = "v1",
        Description = "Backend API for SkillBridge – Freelancer Work Verification Platform"
    });

    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT Bearer token format: Bearer {token}"
    };

    c.AddSecurityDefinition("Bearer", scheme);

    c.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("Bearer"),
            new List<string>()
        }
    });
});

var app = builder.Build();

// Seed Database automatically on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<SkillBridgeDbContext>();
        var hasher = services.GetRequiredService<IPasswordHasher>();
        await DbInitializer.InitializeAsync(context, hasher);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SkillBridge API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("SkillBridgeCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Base health check endpoint
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "Healthy",
    service = "SkillBridge Web API",
    currency = "INR (₹)",
    timestamp = DateTime.UtcNow
}));

app.MapControllers();

app.Run();
