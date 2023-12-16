using System;
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
public class AttendancesController : BaseApiController
{
     private readonly DataContext _context;
    private readonly IMapper _mapper;
    public AttendancesController(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IEnumerable<Attendance>> GetAllAttendances()
    {
        return await _context.Attendances.Include(x => x.Subject).ToListAsync();
    }

    [HttpGet("classes/{classId}")]
    public ActionResult<IEnumerable<Attendance>> GetAttendancesFromClassId(int classId)
    {
        var classFromId = _context.Classes.Find(classId);
        if (classFromId is null) return BadRequest("Nie ma klasy o podanym Id");

        var students = _context.Students.Where(x => x.ClassId == classId);
        if (students is null) return BadRequest("Nie ma studentów w tej klasie");

        List<Attendance> attendances = new();

        foreach (var student in students)
        {
            var gradesInLoop = _context.Attendances.Where(x => x.StudentId == student.Id).ToList();
            attendances.AddRange(gradesInLoop);
        }

        if(attendances is null) return BadRequest("W tej klasie nikt jeszcze nie otrzymał oceny");

        return attendances;
    }

    [HttpGet("{classId}/{subjectId}")]
    public async Task<ActionResult<List<StudentAttendancesDto>>> GetStudentsAttendancesForDisplay(int classId, int subjectId)
    {
        var classFromId = await _context.Classes
            .Include(x => x.Students)
            .ThenInclude(s => s.Attendances)
            .ThenInclude(g => g.Subject)
            .FirstOrDefaultAsync(x => x.Id == classId);

        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        var studentsAttendancesDtoList = new List<StudentAttendancesDto>();

        foreach (var student in classFromId.Students)
        {
            var studentGradesDto = new StudentAttendancesDto
            {
                FirstName = student.FirstName,
                LastName = student.LastName,
                Attendances = _mapper.Map<List<AttendanceDto>>(student.Attendances
                    .Where(g => g.Subject.Id == subjectId))
            };
            foreach (var attendance in studentGradesDto.Attendances)
            {
                var teacher = await _context.Teachers.FindAsync(attendance.TeacherId);
                attendance.TeacherFullName = teacher.LastName + " " + teacher.FirstName;
            }

            studentsAttendancesDtoList.Add(studentGradesDto);
        }

        return studentsAttendancesDtoList.OrderBy(x => x.LastName).OrderBy(x => x.FirstName).ToList();
        
    }

    [HttpGet("students/{studentId}/{subjectId}")]
    public async Task<ActionResult<IEnumerable<Attendance>>> getAttendancesForStudentFromIdAndSubjectId(int studentId, int subjectId)
    {
        var user = await _context.Students.FindAsync(studentId);
        if (user is null) return BadRequest("Zły adres id studenta!");

        return await _context.Attendances.Where(x => x.StudentId == studentId).Where(x => x.Subject.Id == subjectId).ToListAsync(); 
    }

    [HttpPost("{studentId}")]
    public async Task<ActionResult<AttendanceDto>> PostAttendance(PostAttendanceDto attendanceDto, int studentId)
    {
        var student = _context.Students.FirstOrDefault(x => x.Id == studentId);

        if (student is null) return BadRequest("Zły adres id studenta!");

        var teacher = await _context.Teachers.FindAsync(attendanceDto.TeacherId);

        if (teacher is null) return BadRequest("Nie ma nauczyciela o podanym id, który mogłby wystawić obecność");

        var subject = await _context.Subjects.FirstOrDefaultAsync(x => x.Name.ToLower() == attendanceDto.Subject.ToLower());

        if (subject is null) return BadRequest("Probowano wystawić obecność dla przedmiotu, który nie istnieje");

        var attendance = new Attendance
        {
            Description = attendanceDto.Description,
            Value = attendanceDto.Value,
            StudentId = studentId,
            TeacherId = attendanceDto.TeacherId,
            Subject = subject,
            Date = DateTime.UtcNow
        };

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();

        var attendanceDtoForReturn = _mapper.Map<AttendanceDto>(attendance);
        attendanceDtoForReturn.TeacherFullName = teacher.LastName + " " + teacher.FirstName;

        return attendanceDtoForReturn;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAttendance(int id)
    {
        if (id == 0) BadRequest("Nie podano poprawnego id");

        var attendance = await _context.Attendances.FindAsync(id);
        if (attendance is null) BadRequest("Obecność o podanym id nie istnieje");

        var student = await _context.Students.Include(x => x.Attendances).FirstOrDefaultAsync(t => t.Attendances.Any(e => e.Id == id));
        if (student is null) BadRequest("Obecność nie ma swojego studenta");

        student.Attendances.Remove(attendance);
        _context.Attendances.Remove(attendance);
        await _context.SaveChangesAsync();

        return Ok();
    }

}