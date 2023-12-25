using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using AutoMapper;
using AutoMapper.Execution;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class UsersController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    public UsersController(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var users = _context.Users;

        var members = _mapper.ProjectTo<MemberDto>(users);

        return await members.ToListAsync();
    }

    [HttpGet("{id}")] // /api/users/1
    public async Task<ActionResult<MemberDto>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        
        return _mapper.Map<MemberDto>(user);
    }

    [HttpGet("search")]
    public ActionResult<IEnumerable<MemberDto>> GetUsersContainingString([FromQuery] string contains, [FromQuery] string group)
    {
        var resultLastName = _context.Users.AsEnumerable()
            .Where(x => x.LastName
            .Contains(contains, StringComparison.OrdinalIgnoreCase))
            .ToList();

        var resultFirstName = _context.Users.AsEnumerable()
            .Where(x => x.FirstName
            .Contains(contains, StringComparison.OrdinalIgnoreCase))
            .ToList();

        var resultAll = resultLastName.Concat(resultFirstName).Distinct();

        switch(group)
        {
            case "Teachers":
            {
                resultAll = resultAll.OfType<Teacher>().ToList();
            } 
            break;
            case "Students":
            {
                resultAll = resultAll.OfType<Student>().ToList();
            } 
            break;

            default:
            { } 
            break;
        }

        resultAll = resultAll.OrderBy(x => x.LastName).ThenBy(x => x.FirstName);

        var members = _mapper.Map<IEnumerable<MemberDto>>(resultAll);

        return members.ToList();
    }

    [HttpGet("{id}/grades")]
    public async Task<ActionResult<IEnumerable<Grade>>> GetGradesForStudentFromId(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student is null) return BadRequest("Zły adres id studenta!");

        return await _context.Grades.Where(x => x.StudentId == id).ToListAsync(); 
    }

    [HttpGet("{id}/grades/{subjectId}")]
    public async Task<ActionResult<IEnumerable<Grade>>> getGradesForStudentFromIdAndSubjectId(int id, int subjectId)
    {
        var student = await _context.Students.FindAsync(id);
        if (student is null) return BadRequest("Zły adres id studenta!");

        return await _context.Grades.Where(x => x.StudentId == id).Where(x => x.Subject.Id == subjectId).ToListAsync(); 
    }

    [HttpGet("parent/{id}")]
    public async Task<ActionResult<ParentDto>> GetParentWithChildrenIds(int id)
    {
        var parent = await _context.Parents.Include(x => x.StudentChildren).FirstOrDefaultAsync(x => x.Id == id);
        if (parent is null) return BadRequest("Zły adres id rodzica!");

        List<StudentChildrenDto> childrenDtos = new();
        foreach (var child in parent.StudentChildren)
        {
            var studentChildrenDto = new StudentChildrenDto()
            {
                Id = child.Id,
                FirstName = child.FirstName,
                LastName = child.LastName,
            };
            if (child.ClassId != null) studentChildrenDto.ClassId = (int)child.ClassId;
            childrenDtos.Add(studentChildrenDto);
        };

        var parentDto = new ParentDto
        {
            Id = parent.Id,
            FirstName = parent.FirstName,
            LastName = parent.LastName,
            Username = parent.Username,
            AccountType = parent.AccountType,
            StudentChildren = childrenDtos
        };

        return parentDto; 
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return BadRequest("Nie ma użytkownika o podanym id");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

}
