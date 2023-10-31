using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class ClassesController : BaseApiController
{
    private readonly DataContext _context;
    public ClassesController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IEnumerable<Class>> GetClassesAsync()
    {
        var classes = await _context.Classes.Include(x => x.Students).ToListAsync();

        return classes;
    }

    [HttpGet("{id}")]
    public async Task<Class> GetClassAsync(int id)
    {
        return await _context.Classes.FindAsync(id);
    }

    [HttpGet("{id}/students")]
    public async Task<IEnumerable<Student>> GetStudentsFromClassAsync(int id)
    {
        var users = await _context.Students.Where(x => x.ClassId == id).ToListAsync();

        return users;
    }

}
