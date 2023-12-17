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
using SQLitePCL;

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

    [HttpGet("{id}")]
    public async Task<ActionResult<Subject>> GetSubjectFromName(int id)
    {   
        var subject = await _context.Subjects.FindAsync(id);

        if (subject is null) return BadRequest("Taki przedmiot nie istnieje");

        return subject;
    }

    [HttpGet("search")]
    public ActionResult<IEnumerable<Subject>> GetSubjectsContainingString([FromQuery] string contains)
    {
        var resultName = _context.Subjects
            .AsEnumerable()
            .Where(x => x.Name
            .Contains(contains, StringComparison.OrdinalIgnoreCase))
            .OrderBy(x => x.Name);

        return resultName.ToList();
    }

    // [HttpGet("{name}")]
    // public async Task<ActionResult<Subject>> GetSubjectFromName(string name)
    // {   
    //     var subject = await _context.Subjects.FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());

    //     if (subject is null) return BadRequest("Taki przedmiot nie istnieje");

    //     return subject;
    // }

    [HttpPost]
    public async Task<ActionResult<Subject>> AddSubjectAsync(SubjectDto subjectDto)
    {
        var existingSubject = await _context.Subjects.FirstOrDefaultAsync(x => x.Name == subjectDto.Name);
        if (existingSubject != null) return BadRequest("Istnieje już przedmiot o podanej nazwie!");

        var subject = new Subject
        {
            Name = subjectDto.Name
        };

        _context.Subjects.Add(subject);
        await _context.SaveChangesAsync();

        return subject;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteSubject(int id)
    {
        var subject = await _context.Subjects.FindAsync(id);
        if (subject is null) BadRequest("Nie ma przedmiotu o podanym id");

        _context.Subjects.Remove(subject);
        await _context.SaveChangesAsync();

        return Ok();
    }
}