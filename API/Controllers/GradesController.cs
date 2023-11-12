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
        return await _context.Grades.ToListAsync();
    }

    // [HttpGet("{id}")]
    // public async Task<IEnumerable<Grade>> GetAllGradesForStudent(int id)
    // {
    //     var userGrades = await _context.Grades.Where(x => x.StudentId == id).ToListAsync();
        
    //     return userGrades;
    // }

    [HttpPost("{studentId}")]
    public async Task<ActionResult<Grade>> PostGrade(GradeDto gradeDto, int studentId)
    {
        var student = _context.Users
            .FirstOrDefault(x => x.Id == studentId);

        if (student is null) return BadRequest("Zły adres id studenta!");

        if (student.AccountType != "Student") return BadRequest("Id nie należy do studenta!"); 

        var grade = new Grade
        {
            Description = gradeDto.Description,
            Value = gradeDto.Value,
            StudentId = studentId
        };

        _context.Grades.Add(grade);
        await _context.SaveChangesAsync();

        return Ok(grade);
    }

}