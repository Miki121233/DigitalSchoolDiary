using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
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
        return await _context.Classes
            .Include(x => x.Students)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    [HttpGet("{id}/students")]
    public async Task<ActionResult<IEnumerable<Student>>> GetStudentsFromClassAsync(int id)
    {
        var users = await _context.Students.Where(x => x.ClassId == id).ToListAsync();

        if (users is null) return BadRequest("Ta klasa nie zawiera jeszcze studentów");

        return users;
    }

    [HttpGet("{id}/grades")]   //classes/1/grades
    public ActionResult<IEnumerable<Grade>> GetGradesFromClassId(int id)
    {
        // ocena ma studentid => student ma studentid i classid przypisana => ja mam classid
        // musze wziac z classid class=> z class
        var classFromId = _context.Classes.Find(id);

        if (classFromId is null) return BadRequest("Nie ma klasy o podanym Id");

        var students = _context.Students.Where(x => x.ClassId == id);

        if (students is null) return BadRequest("Nie ma studentów w tej klasie");

        List<Grade> grades = new List<Grade>();

        foreach (var student in students)
        {
            var gradesInLoop = _context.Grades.Where(x => x.StudentId == student.Id).ToList();
            grades.AddRange(gradesInLoop);
        }

        if(grades is null) return BadRequest("W tej klasie nikt jeszcze nie otrzymał oceny");

        return grades;
    }

    [HttpPost] 
    public async Task<ActionResult<IEnumerable<Class>>> CreateClass(ClassDto classDto)
    {
        var classForComparison = _context.Classes.FirstOrDefault(x => x.Year == classDto.Year);
        if(classForComparison != null)
            if(classForComparison.ClassLetterId == classDto.ClassLetterId)
                return BadRequest($"Klasa {classDto.Year}{classDto.ClassLetterId} już istnieje!");
        
        var classModel = new Class
        {
            Year = classDto.Year,
            ClassLetterId = classDto.ClassLetterId.ToUpper()
        };

        _context.Classes.Add(classModel);
        await _context.SaveChangesAsync();

        return Ok(classModel);
    }

}
