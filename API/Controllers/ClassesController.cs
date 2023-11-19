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

        return users.OrderBy(x => x.LastName).OrderBy(x => x.FirstName).ToList();
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

    [HttpGet("{id}/subjects")]
    public async Task<ActionResult<IEnumerable<Subject>>> GetSubjectsFromClassId(int id)
    {
        var classSearched = await _context.Classes.Include(x => x.Subjects).FirstOrDefaultAsync(x => x.Id == id);

        if (classSearched is null) BadRequest("Nie ma klasy z takim id");

        return classSearched.Subjects;
    }

    [HttpPost("{id}/subjects")]
    public async Task<ActionResult<IEnumerable<Subject>>> AddSubjectToClassAsync(int id, SubjectDto subjectDto)
    {
        var classFromId = await _context.Classes.FindAsync(id);

        if (classFromId is null) return BadRequest("Klasa o podanym id nie istnieje");

        var subject = await _context.Subjects.FirstOrDefaultAsync(x => x.Name == subjectDto.Name);

        if (subject is null) return BadRequest("Przedmiot o podanej nazwie nie istnieje w systemie");

        if (classFromId.Subjects.Any(x => x.Name == subjectDto.Name))
        {
            return BadRequest("Przedmiot jest już przypisany do klasy");
        }

        classFromId.Subjects.Add(subject);

        await _context.SaveChangesAsync();

        return classFromId.Subjects;        
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

    [HttpGet("get-school-id/{classId}")]
    public async Task<ActionResult<string>> GetSchoolIdFromClassId(int classId)
    {
        var classFromId = await _context.Classes.FindAsync(classId);
        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        return classFromId.SchoolId;
    }

}
