using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
//[Authorize]
public class UsersController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    public UsersController(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [AllowAnonymous]
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

    [HttpGet("{id}/grades")]
    public async Task<ActionResult<IEnumerable<Grade>>> GetGradesForStudentFromId(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null) return BadRequest("Zły adres id studenta!");

        if (user.AccountType == "Teacher" || user.AccountType == "Parent") return BadRequest("Tylko uczniowie mają oceny!");

        return await _context.Grades.Where(x => x.StudentId == id).ToListAsync(); 
    }

    [HttpGet("{id}/grades/{subjectId}")]
    public async Task<ActionResult<IEnumerable<Grade>>> getGradesForStudentFromIdAndSubjectId(int id, int subjectId)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null) return BadRequest("Zły adres id studenta!");

        if (user.AccountType == "Teacher" || user.AccountType == "Parent") return BadRequest("Tylko uczniowie mają oceny!");

        return await _context.Grades.Where(x => x.StudentId == id).Where(x => x.Subject.Id == subjectId).ToListAsync(); 
    }

    [HttpGet("parent/{id}")]
    public async Task<ActionResult<ParentDto>> GetParentWithChildrenIds(int id)
    {
        var parent = await _context.Parents.Include(x => x.StudentChildren).FirstOrDefaultAsync(x => x.Id == id);

        if (parent is null) return BadRequest("Zły adres id rodzica!");

        if (parent.AccountType != "Parent") return BadRequest("Konto nie należy do rodzica!");

        List<StudentChildrenDto> childrenDtos = new();
        foreach (var child in parent.StudentChildren)
        {
            childrenDtos.Add(new StudentChildrenDto()
            {
                Id = child.Id,
                FirstName = child.FirstName,
                LastName = child.LastName,
                ClassId = child.ClassId
            });
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

}
