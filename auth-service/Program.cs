using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using auth_service.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//Esto es la configuracion de Servicios o la "Dependency Injection"
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//Esto es la configuracion de la base de datos de SQLite
//Indicamos la ceacion del archivo local llamado auth.db
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=auth.db"));

// Aca vamos a meter la coneccion con SQLite

//Aca va a ir la validacaion en JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer (options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseAuthentication(); //Lo habilitare cuando configure el JWT

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();