using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class EventsController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    public EventsController(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> GetAllEvents()
    {
        return await _context.Events.ToListAsync();
    }

    [HttpGet("classes/{classId}")]
    public async Task<ActionResult<IEnumerable<Event>>> GetEventsFromClassId(int classId)
    {
        var classFromId = await _context.Classes.Include(x => x.Events).FirstOrDefaultAsync(x => x.Id == classId);
        if (classFromId is null) return BadRequest("Klasa o podanym adresie id nie istnieje");

        return classFromId.Events;
    }

    [HttpPost("classes/{classId}")]
    public async Task<ActionResult<Event>> PostEvent(int classId, PostEventDto eventDto) //sprawdzic jeszcze czy przedmiot jest w bazie klasy
    {
        var classFromId = await _context.Classes.FindAsync(classId);
        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");
        
        var creator = await _context.Teachers.FindAsync(eventDto.CreatorId);
        if (creator is null) return BadRequest("Nie ma nauczyciela o podanym id");  

        var eventForReturn = _mapper.Map<Event>(eventDto);

        var assignedPerson = await _context.Teachers.FindAsync(eventDto.AssignedPersonId);
        if (assignedPerson != null)
            assignedPerson.Events.Add(eventForReturn);

        classFromId.Events.Add(eventForReturn);
        await _context.SaveChangesAsync();

        return eventForReturn;
    }



}