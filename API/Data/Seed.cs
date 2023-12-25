using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;
public class Seed
{
    private readonly DataContext _context;

    public Seed(DataContext context)
    {
        _context = context;
    }

    public async Task SeedSchoolCalendar()
    {
        if (await _context.Calendars.AnyAsync()) return;

        var newCalendar = new Calendar
        {
            Id = 1,
            Title = "Kalendarz szkolny"  
        };

        await _context.Calendars.AddAsync(newCalendar);
        await _context.SaveChangesAsync();
    }

    public async Task SeedDirectorAccount()
    {
        if (await _context.Directors.AnyAsync()) return;

        using var hmac = new HMACSHA512();

        var password = "hasło";

        var director = new Director
        {
            FirstName = "Dariusz",
            LastName = "Dębowy",
            Username = "admin",
            Gender = "male",
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
            PasswordSalt = hmac.Key,
        };

        await _context.Directors.AddAsync(director);
        await _context.SaveChangesAsync();
    }
}