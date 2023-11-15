using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class SubjectsController : BaseApiController
{
    private readonly DataContext _context;
    public SubjectsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IEnumerable<Subject>> GetSubjectsAsync()
    {
        return await _context.Subjects.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Subject>> AddSubjectAsync(SubjectDto subjectDto)
    {
        var subject = new Subject
        {
            Name = subjectDto.Name
        };

        _context.Subjects.Add(subject);
        await _context.SaveChangesAsync();

        return subject;
    }
}