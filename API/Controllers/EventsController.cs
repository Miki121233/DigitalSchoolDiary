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

    [HttpGet("teachers/{teacherId}")]
    public async Task<ActionResult<IEnumerable<Event>>> LoadTeacherEventsFromId(int teacherId)
    {
        var teacher = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(x => x.Id == teacherId);
        if (teacher is null) return BadRequest("Nauczyciel o podanym adresie id nie istnieje");

        return teacher.Events;
    }    

    [HttpPut("{id}")]
    public async Task<ActionResult<Event>> EditEvent(int id, ChangeEventDto eventDto)
    {
        var eventFromId = await _context.Events.FindAsync(id);
        if (eventFromId is null) return NotFound("Nie ma wydarzenia o podanym id");

        if(eventDto.AssignedPersonId != 0) 
        {
            var teacherPreviouslyAssigned = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(t => t.Events.Any(e => e.Id == id));
            if (teacherPreviouslyAssigned != null) 
            {
                var eventToRemove = teacherPreviouslyAssigned.Events.FirstOrDefault(e => e.Id == id);
                if (eventToRemove != null) 
                {
                    teacherPreviouslyAssigned.Events.Remove(eventToRemove);
                }
            }

            var teacherToAssign = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(t => t.Id == eventDto.AssignedPersonId);
            if (teacherToAssign != null) 
            {
                teacherToAssign.Events.Add(eventFromId);
            }
            else return BadRequest("Nauczyciel o podanym id nie istnieje");

        }

        _mapper.Map(eventDto, eventFromId);
        await _context.SaveChangesAsync();

        return eventFromId;
    }

    [HttpPost("classes/{classId}")]
    public async Task<ActionResult<Event>> PostEvent(int classId, PostEventDto eventDto) //sprawdzic jeszcze czy przedmiot jest w bazie klasy
    {
        var classFromId = await _context.Classes.FindAsync(classId);
        if (classFromId is null) return NotFound("Nie ma klasy o podanym id");
        
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

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteEvent(int id)
    {
        var eventFromId = await _context.Events.FindAsync(id);
        if (eventFromId is null) return NotFound("Nie ma wydarzenia o podanym id");

        var assignedClass = await _context.Classes.Include(x => x.Events).FirstOrDefaultAsync(t => t.Events.Any(e => e.Id == id));
        if (assignedClass is null) return BadRequest("Wydarzenie nie ma przypisanej klasy");
        assignedClass.Events.Remove(eventFromId);

        var assignedTeacher = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(t => t.Events.Any(e => e.Id == id));
        if (assignedTeacher != null) 
        {
            assignedTeacher.Events.Remove(eventFromId);
        }
        
        _context.Events.Remove(eventFromId);
        await _context.SaveChangesAsync();
        
        return Ok();
    }

}