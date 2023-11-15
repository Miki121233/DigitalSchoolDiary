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

    [HttpPost("{studentId}")]
    public async Task<ActionResult<Grade>> PostGrade(PostGradeDto gradeDto, int studentId)
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
            Subject = subject
        };

        _context.Grades.Add(grade);
        await _context.SaveChangesAsync();

        return Ok(grade);
    }

}