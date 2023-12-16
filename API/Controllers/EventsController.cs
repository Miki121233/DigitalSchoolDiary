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
    public async Task<ActionResult<IEnumerable<EventDtoForClass>>> GetEventsFromClassId(int classId)
    {
        var classFromId = await _context.Classes.Include(x => x.Events).FirstOrDefaultAsync(x => x.Id == classId);
        if (classFromId is null) return BadRequest("Klasa o podanym adresie id nie istnieje");

        List<EventDtoForClass> eventDtos = _mapper.Map<List<EventDtoForClass>>(classFromId.Events);

        var teacherAssigned = new Teacher();
        foreach (var eventIteration in eventDtos)
        {
            teacherAssigned = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(t => t.Events.Any(e => e.Id == eventIteration.Id));
            if (teacherAssigned != null)
            {
                eventIteration.AssignedTeacherId = teacherAssigned.Id;
                eventIteration.AssignedTeacherFirstName = teacherAssigned.FirstName;
                eventIteration.AssignedTeacherLastName = teacherAssigned.LastName;
            }
        }

        return eventDtos;
    }

    [HttpGet("calendars/{calendarId}")]
    public async Task<ActionResult<IEnumerable<EventDtoForClass>>> GetEventsFromCalendarId(int calendarId)
    {
        var calendarFromId = await _context.Calendars.Include(x => x.Events).FirstOrDefaultAsync(x => x.Id == calendarId);
        if (calendarFromId is null) return BadRequest("Kalendarz o podanym adresie id nie istnieje");

        List<EventDtoForClass> eventDtos = _mapper.Map<List<EventDtoForClass>>(calendarFromId.Events);

        var teacherAssigned = new Teacher();
        foreach (var eventIteration in eventDtos)
        {
            teacherAssigned = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(t => t.Events.Any(e => e.Id == eventIteration.Id));
            if (teacherAssigned != null)
            {
                eventIteration.AssignedTeacherId = teacherAssigned.Id;
                eventIteration.AssignedTeacherFirstName = teacherAssigned.FirstName;
                eventIteration.AssignedTeacherLastName = teacherAssigned.LastName;
            }
        }

        return eventDtos;
    }

    [HttpGet("teachers/{teacherId}")]
    public async Task<ActionResult<IEnumerable<EventDtoForTeacher>>> LoadTeacherEventsFromId(int teacherId)
    {
        var teacher = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(x => x.Id == teacherId);
        if (teacher is null) return BadRequest("Nauczyciel o podanym adresie id nie istnieje");

        List<EventDtoForTeacher> eventDtos = _mapper.Map<List<EventDtoForTeacher>>(teacher.Events);

        var classAssigned = new Class();
        foreach (var eventIteration in eventDtos)
        {
            classAssigned = await _context.Classes.Include(x => x.Events).FirstOrDefaultAsync(t => t.Events.Any(e => e.Id == eventIteration.Id));
            if (classAssigned != null) eventIteration.ClassSchoolId = classAssigned.SchoolId;
        }

        return eventDtos;
    }    

    [HttpPut("{id}")]
    public async Task<ActionResult<EventDtoForClass>> EditEvent(int id, ChangeEventDto eventDto)
    {
        var eventFromId = await _context.Events.FindAsync(id);
        if (eventFromId is null) return NotFound("Nie ma wydarzenia o podanym id");

        var teacherPreviouslyAssigned = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(t => t.Events.Any(e => e.Id == id));
        if (teacherPreviouslyAssigned != null && eventDto.AssignedTeacherId != 0) 
        {
            if(eventDto.AssignedTeacherId != teacherPreviouslyAssigned.Id) 
            {
                var eventToRemove = teacherPreviouslyAssigned.Events.FirstOrDefault(e => e.Id == id);
                if (eventToRemove != null) 
                {
                    teacherPreviouslyAssigned.Events.Remove(eventToRemove);
                }
                var teacherToAssign = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(t => t.Id == eventDto.AssignedTeacherId);
                if (teacherToAssign != null) 
                {
                    teacherToAssign.Events.Add(eventFromId);
                }
                else return BadRequest("Nauczyciel o podanym id nie istnieje");
            }
        }
        else if (teacherPreviouslyAssigned != null && eventDto.AssignedTeacherId == 0)
        {
            if(eventDto.AssignedTeacherId != teacherPreviouslyAssigned.Id) 
            {
                var eventToRemove = teacherPreviouslyAssigned.Events.FirstOrDefault(e => e.Id == id);
                if (eventToRemove != null) 
                {
                    teacherPreviouslyAssigned.Events.Remove(eventToRemove);
                }
            }
        }
        else if (teacherPreviouslyAssigned is null && eventDto.AssignedTeacherId != 0)
        {
            var teacherToAssign = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(t => t.Id == eventDto.AssignedTeacherId);
            if (teacherToAssign != null) 
            {
                teacherToAssign.Events.Add(eventFromId);
            }
            else return BadRequest("Nauczyciel o podanym id nie istnieje");
        }
        else if (teacherPreviouslyAssigned is null && eventDto.AssignedTeacherId == 0) { }
        
        _mapper.Map(eventDto, eventFromId);
        var eventDtoForClass = _mapper.Map<EventDtoForClass>(eventFromId);

        var newAssignedTeacher = await _context.Teachers.FindAsync(eventDto.AssignedTeacherId);
        if (newAssignedTeacher != null)
        {
            eventDtoForClass.AssignedTeacherFirstName = newAssignedTeacher.FirstName;
            eventDtoForClass.AssignedTeacherLastName = newAssignedTeacher.LastName;
        }
        eventDtoForClass.AssignedTeacherId = eventDto.AssignedTeacherId;


        await _context.SaveChangesAsync();

        return eventDtoForClass;
    }

    [HttpPost("classes/{classId}")]
    public async Task<ActionResult<Event>> PostEventForClass(int classId, PostEventDto eventDto)
    {
        var classFromId = await _context.Classes.FindAsync(classId);
        if (classFromId is null) return NotFound("Nie ma klasy o podanym id");
        
        var creator = await _context.Teachers.FindAsync(eventDto.CreatorId);
        if (creator is null) return BadRequest("Nie ma nauczyciela o podanym id");  

        var eventForReturn = _mapper.Map<Event>(eventDto);

        var assignedPerson = await _context.Teachers.FindAsync(eventDto.AssignedTeacherId);
        if (assignedPerson != null)
            assignedPerson.Events.Add(eventForReturn);

        classFromId.Events.Add(eventForReturn);
        await _context.SaveChangesAsync();

        return eventForReturn;
    }

    [HttpPost("calendars/{calendarId}")]
    public async Task<ActionResult<Event>> PostEventForCalendar(int calendarId, PostEventDto eventDto)
    {
        var calendarFromId = await _context.Calendars.FindAsync(calendarId);
        if (calendarFromId is null) return NotFound("Nie ma kalendarza o podanym id");
        
        var creator = await _context.Teachers.FindAsync(eventDto.CreatorId);
        if (creator is null) return BadRequest("Nie ma nauczyciela o podanym id");  

        var eventForReturn = _mapper.Map<Event>(eventDto);

        var assignedPerson = await _context.Teachers.FindAsync(eventDto.AssignedTeacherId);
        if (assignedPerson != null)
            assignedPerson.Events.Add(eventForReturn);

        calendarFromId.Events.Add(eventForReturn);
        await _context.SaveChangesAsync();

        return eventForReturn;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteEvent(int id)
    {
        var eventFromId = await _context.Events.FindAsync(id);
        if (eventFromId is null) return NotFound("Nie ma wydarzenia o podanym id");

        var assignedClass = await _context.Classes.Include(x => x.Events).FirstOrDefaultAsync(t => t.Events.Any(e => e.Id == id));
        if (assignedClass != null) assignedClass.Events.Remove(eventFromId);

        var assignedCalendar = await _context.Calendars.Include(x => x.Events).FirstOrDefaultAsync(t => t.Events.Any(e => e.Id == id));
        if (assignedCalendar != null) assignedCalendar.Events.Remove(eventFromId);

        var assignedTeacher = await _context.Teachers.Include(x => x.Events).FirstOrDefaultAsync(t => t.Events.Any(e => e.Id == id));
        if (assignedTeacher != null) assignedTeacher.Events.Remove(eventFromId);
        
        _context.Events.Remove(eventFromId);
        await _context.SaveChangesAsync();
        
        return Ok();
    }

}