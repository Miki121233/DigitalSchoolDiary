using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class GradesController : BaseApiController
{
    private readonly DataContext _context;
    public GradesController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IEnumerable<Grade>> GetAllGrades()
    {
        return await _context.Grades.Include(x => x.Subject).ToListAsync();
    }

    [HttpGet("{classId}/{subjectId}")]
    public async Task<ActionResult<List<StudentGradesDto>>> GetStudentsGradesForDisplay(int classId, int subjectId)
    {
        // var classFromId = _context.Classes.Include(x => x.Students).Where(x => x.Id == classId);

        // if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        // var gradesFromSubject = _context.Grades.Where(x => x.Subject.Id == subjectId);

        // // var studentsFromGrades = _context.Students.Include(x => x.Grades).Where(x => x.Grades.sub)
        
        // var studentsFromThisClass = classFromId.Students;

        var classFromId = await _context.Classes
            .Include(x => x.Students)
            .ThenInclude(s => s.Grades)
            .ThenInclude(g => g.Subject)
            .FirstOrDefaultAsync(x => x.Id == classId);

        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        var studentsGradesDtoList = new List<StudentGradesDto>();

        foreach (var student in classFromId.Students)
        {
            var studentGradesDto = new StudentGradesDto
            {
                FirstName = student.FirstName,
                LastName = student.LastName,
                Grades = student.Grades
                    .Where(g => g.Subject.Id == subjectId)
                    .ToList()
            };

            studentsGradesDtoList.Add(studentGradesDto);
        }

        return studentsGradesDtoList.OrderBy(x => x.LastName).OrderBy(x => x.FirstName).ToList();
        
    }

    [HttpPost("{studentId}")]
    public async Task<ActionResult<Grade>> PostGrade(PostGradeDto gradeDto, int studentId) //sprawdzic jeszcze czy przedmiot jest w bazie klasy
    {
        var student = _context.Users.FirstOrDefault(x => x.Id == studentId);

        if (student is null) return BadRequest("Zły adres id studenta!");

        if (student.AccountType != "Student") return BadRequest("Id nie należy do studenta!"); 

        var teacher = await _context.Teachers.FindAsync(gradeDto.TeacherId);

        if (teacher is null) return BadRequest("Nie ma nauczyciela o podanym id, który mogłby wystawić ocenę");

        var subject = await _context.Subjects.FirstOrDefaultAsync(x => x.Name.ToLower() == gradeDto.Subject.ToLower());

        if (subject is null) return BadRequest("Probowano wystawić ocenę dla przedmiotu, który nie istnieje");

        var grade = new Grade
        {
            Description = gradeDto.Description,
            Value = gradeDto.Value,
            StudentId = studentId,
            TeacherId = gradeDto.TeacherId,
            Subject = subject,
            Date = DateTime.UtcNow
        };

        _context.Grades.Add(grade);
        await _context.SaveChangesAsync();

        return Ok(grade);
    }

}