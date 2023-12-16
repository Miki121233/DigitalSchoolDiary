using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class CalendarsController : BaseApiController
{
    private readonly DataContext _context;

    public CalendarsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IEnumerable<Calendar>> GetAllCalendarsWithEvents()
    {
        return await _context.Calendars.Include(x => x.Events).ToListAsync();
    } 

    [HttpGet("{id}")]
    public async Task<ActionResult<Calendar>> GetCalendarsWithEvents(int id)
    {
        var calendar = await _context.Calendars.Include(x => x.Events).FirstOrDefaultAsync(x => x.Id == id);
        if (calendar is null) return BadRequest("Zły id kalendarza");

        return calendar;
    } 
}