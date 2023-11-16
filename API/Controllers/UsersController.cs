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


        // AppUser userForReturn;
        // switch (user.AccountType)
        // {
        //     case "Student":
        //         {
        //             userForReturn = await _context.Students.FindAsync(id);
        //         }
        //         break;
        //     case "Parent":
        //         {
        //             userForReturn = await _context.Parents.FindAsync(id);
        //         }
        //         break;
        //     case "Teacher":
        //         {
        //             userForReturn = await _context.Teachers.FindAsync(id);
        //         }
        //         break;
        //     default:
        //         {
        //             return BadRequest("Błąd z typem konta");
        //         }
        // }

        // return userForReturn;
    }

    
//  getGradesForStudentFromId(studentId: number) {
//     return this.http.get<Grade[]>(this.baseUrl + 'users/'+ studentId + 'grades/');
//   }
    [HttpGet("{id}/grades")]
    public async Task<ActionResult<IEnumerable<Grade>>> GetGradesForStudentFromId(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null) return BadRequest("Zły adres id studenta!");

        if (user.AccountType == "Teacher" || user.AccountType == "Parent") return BadRequest("Tylko uczniowie mają oceny!");

        return await _context.Grades.Where(x => x.StudentId == id).ToListAsync(); 
    }

//     getGradesForStudentFromIdAndSubjectId(studentId: number, subjectId: number) {
//     return this.http.get<Grade[]>(this.baseUrl + 'users/'+ studentId + '/grades/' + subjectId);
//   }

    [HttpGet("{id}/grades/{subjectId}")]
    public async Task<ActionResult<IEnumerable<Grade>>> getGradesForStudentFromIdAndSubjectId(int id, int subjectId)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null) return BadRequest("Zły adres id studenta!");

        if (user.AccountType == "Teacher" || user.AccountType == "Parent") return BadRequest("Tylko uczniowie mają oceny!");

        return await _context.Grades.Where(x => x.StudentId == id).Where(x => x.Subject.Id == subjectId).ToListAsync(); 
    }

}
