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
public class HomeworksController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    public HomeworksController(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IEnumerable<Homework>> GetHomeworksAsync()
    {
        return await _context.Homeworks.Include(x => x.Subject).ToListAsync();
    }

    [HttpGet("{classId}/{subjectId}")]
    public async Task<IEnumerable<HomeworkDto>> GetHomeworksFromClassIdAndSubjectId(int classId, int subjectId)
    {
        var homeworksWithinClass = _context.Homeworks.Where(x => x.ClassId == classId).Include(x => x.Subject);

        var homeworksFromSubjectId = homeworksWithinClass.Where(x => x.Subject.Id == subjectId);

        var homeworkDto = _mapper.Map<IEnumerable<HomeworkDto>>(homeworksFromSubjectId);
        foreach (var homework in homeworkDto)
        {
            var teacher = await _context.Teachers.FindAsync(homework.TeacherId);
            homework.TeacherFullName = teacher.LastName + " " + teacher.FirstName;
        }

        return homeworkDto.ToList();
    }

    [HttpPost("{classId}")]
    public async Task<ActionResult<HomeworkDto>> AddHomeworkToClass(int classId, PostHomeworkDto homeworkDto)
    {
        var classFromId = await _context.Classes.FindAsync(classId);
        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        var subject = await _context.Subjects.FirstOrDefaultAsync(x => x.Id == homeworkDto.SubjectId);
        if (subject is null) return BadRequest("Nie ma takiego przedmiotu w bazie");

        var teacher = await _context.Teachers.FindAsync(homeworkDto.TeacherId);
        if (teacher is null) return BadRequest("Nie ma nauczyciela o podanym id");

        var homework = new Homework {
            Description = homeworkDto.Description,
            Comment = homeworkDto.Comment,
            TeacherId = homeworkDto.TeacherId,
            ClassId = classId,
            PublishDate = DateTime.UtcNow,
            Deadline = homeworkDto.Deadline,
            Subject = subject
        };

        _context.Homeworks.Add(homework);
        await _context.SaveChangesAsync();

        var homeworkDtoForReturn = _mapper.Map<HomeworkDto>(homework);
        homeworkDtoForReturn.TeacherFullName = teacher.LastName + " " + teacher.FirstName;

        return homeworkDtoForReturn;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteHomework(int id)
    {
        if (id == 0) BadRequest("Nie podano poprawnego id");

        var homework = await _context.Homeworks.FindAsync(id);
        if (homework is null) BadRequest("Zadanie o podanym id nie istnieje");

        _context.Homeworks.Remove(homework);
        await _context.SaveChangesAsync();

        return Ok();
    }

}