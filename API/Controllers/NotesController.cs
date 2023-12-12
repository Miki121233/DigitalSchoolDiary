using System;
using System.Collections;
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
public class NotesController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    public NotesController(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IEnumerable<Note>> GetAllNotes()
    {
        return await _context.Notes.ToListAsync();
    }

    [HttpGet("students/{studentId}")]
    public async Task<ActionResult<IEnumerable<NoteDto>>> GetNotesForStudent(int studentId)
    {
        var student = await _context.Students.Include(x => x.Notes).FirstOrDefaultAsync(x => x.Id == studentId);
        if (student is null) return BadRequest("Student o podanym id nie istnieje");

        var notesDto = _mapper.Map<IEnumerable<NoteDto>>(student.Notes);
        foreach (var note in notesDto)
        {
            var teacher = await _context.Teachers.FindAsync(note.TeacherId);
            if (teacher != null) 
                note.TeacherFullName = teacher.LastName + " " + teacher.FirstName;
        }

        return notesDto.ToList();
    }

    [HttpGet("classes/{classId}")]
    public async Task<ActionResult<IEnumerable<StudentNotesDto>>> GetNotesForAllStudentsInClass(int classId)
    {
        var classFromId = await _context.Classes
            .Include(x => x.Students)
            .ThenInclude(x => x.Notes)
            .FirstOrDefaultAsync(x => x.Id == classId);

        if (classFromId is null) BadRequest("Nie ma klasy o podanym id");

        var studentsNotesDtoList = new List<StudentNotesDto>();

        foreach (var student in classFromId.Students)
        {
            var studentNotesDto = new StudentNotesDto
            {
                Id = student.Id,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Notes = _mapper
                    .Map<List<NoteDto>>(student.Notes)
            };
            foreach (var note in studentNotesDto.Notes)
            {
                var teacher = await _context.Teachers.FindAsync(note.TeacherId);
                if (teacher != null)
                    note.TeacherFullName = teacher.LastName + " " + teacher.FirstName;
            }

            studentsNotesDtoList.Add(studentNotesDto);
        }

        return studentsNotesDtoList.OrderBy(x => x.LastName).OrderBy(x => x.FirstName).ToList();
    }

    [HttpPost("students/{studentId}")]
    public async Task<ActionResult<NoteDto>> PostNote(PostNoteDto noteDto, int studentId) //sprawdzic jeszcze czy przedmiot jest w bazie klasy
    {
        var student = _context.Students.Include(x => x.Notes).FirstOrDefault(x => x.Id == studentId);

        if (student is null) return BadRequest("Zły adres id studenta!");

        var teacher = await _context.Teachers.FindAsync(noteDto.TeacherId);

        if (teacher is null) return BadRequest("Nie ma nauczyciela o podanym id, który mogłby wystawić uwagę");

        var note = new Note
        {
            Description = noteDto.Description,
            IsPositive = noteDto.IsPositive,
            TeacherId = noteDto.TeacherId            
        };

        _context.Notes.Add(note);
        student.Notes.Add(note);
        await _context.SaveChangesAsync();

        var noteDtoForReturn = _mapper.Map<NoteDto>(note);
        noteDtoForReturn.TeacherFullName = teacher.LastName + " " + teacher.FirstName;

        return noteDtoForReturn;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteNote(int id)
    {
        if (id == 0) BadRequest("Nie podano poprawnego id");

        var note = await _context.Notes.FindAsync(id);
        if (note is null) BadRequest("Uwaga o podanym id nie istnieje");

        var student = await _context.Students.Include(x => x.Notes).FirstOrDefaultAsync(t => t.Notes.Any(e => e.Id == id));
        if (student is null) BadRequest("Uwaga nie ma swojego studenta");

        student.Notes.Remove(note);
        _context.Notes.Remove(note);
        await _context.SaveChangesAsync();

        return Ok();
    }

}