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
public class ClassesController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public ClassesController(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IEnumerable<GetClassDto>> GetClassesAsync()
    {
        var classes = await _context.Classes.Include(x => x.Students).ToListAsync();

        var classDto = _mapper.Map<IEnumerable<GetClassDto>>(classes);

        return classDto.ToList();
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
        var students = await _context.Students.Where(x => x.ClassId == id).ToListAsync();
        if (students is null) return BadRequest("Ta klasa nie zawiera jeszcze studentów");

        return students.OrderBy(x => x.LastName).OrderBy(x => x.FirstName).ToList();
    }

    [HttpGet("{id}/grades")] //classes/1/grades
    public ActionResult<IEnumerable<Grade>> GetGradesFromClassId(int id)
    {
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
    public async Task<ActionResult<GetClassDto>> CreateClass(ClassDto classDto)
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

        var classDtoForReturn = new GetClassDto()
        {
            Id = classModel.Id,
            SchoolId = classModel.SchoolId
        };

        return classDtoForReturn;
    }

    [HttpPost("{id}/students/{studentId}")] 
    public async Task<ActionResult<Student>> AddStudentToClass(int id, int studentId)
    {
        var classFromId = await _context.Classes.Include(x => x.Students).FirstOrDefaultAsync(x => x.Id == id);
        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        var student = await _context.Students.FindAsync(studentId);
        if (student is null) return BadRequest("Nie ma ucznia o podanym id");

        var alreadyExists = classFromId.Students.Any(x => x.Id == studentId);
        if (alreadyExists) return BadRequest("Ta osoba jest już przypisana do tej klasy");

        classFromId.Students.Add(student);
        student.ClassId = id;

        await _context.SaveChangesAsync();

        return student;
    }

    [HttpDelete("{id}/students/{studentId}")] 
    public async Task<ActionResult> DeleteStudentFromClass(int id, int studentId)
    {
        var classFromId = await _context.Classes.Include(x => x.Students).FirstOrDefaultAsync(x => x.Id == id);
        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        var student = classFromId.Students.FirstOrDefault(x => x.Id == studentId);
        if (student is null) return BadRequest("Nie ma ucznia o podanym id");

        classFromId.Students.Remove(student);
        student.ClassId = null;

        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("{id}/subjects/{subjectId}")] 
    public async Task<ActionResult<Subject>> AddSubjectToClass(int id, int subjectId)
    {
        var classFromId = await _context.Classes.Include(x => x.Subjects).FirstOrDefaultAsync(x => x.Id == id);
        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        var subject = await _context.Subjects.FindAsync(subjectId);
        if (subject is null) return BadRequest("Nie ma przedmiotu o podanym id");

        var alreadyExists = classFromId.Subjects.Any(x => x.Name == subject.Name);
        if (alreadyExists) return BadRequest("Ten przedmiot jest już przypisany do tej klasy");

        classFromId.Subjects.Add(subject);

        await _context.SaveChangesAsync();

        return subject;
    }

    [HttpDelete("{id}/subjects/{subjectId}")] 
    public async Task<ActionResult> DeleteSubjectFromClass(int id, int subjectId)
    {
        var classFromId = await _context.Classes.Include(x => x.Subjects).FirstOrDefaultAsync(x => x.Id == id);
        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        var subject = classFromId.Subjects.FirstOrDefault(x => x.Id == subjectId);
        if (subject is null) return BadRequest("Nie ma przedmiotu o podanym id");

        classFromId.Subjects.Remove(subject);

        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("get-school-id/{classId}")]
    public async Task<ActionResult<string>> GetSchoolIdFromClassId(int classId)
    {
        var classFromId = await _context.Classes.FindAsync(classId);
        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        return classFromId.SchoolId;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteClass(int id)
    {
        var classFromId = await _context.Classes.FindAsync(id);
        if (classFromId is null) return BadRequest("Nie ma klasy o podanym id");

        var studentsFromClass = _context.Students.Where(x => x.ClassId == id);
        foreach (var student in studentsFromClass)
        {
            student.ClassId = 0;
        }

        _context.Classes.Remove(classFromId);
        await _context.SaveChangesAsync();

        return Ok();
    }


}
