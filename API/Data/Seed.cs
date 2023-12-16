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
}