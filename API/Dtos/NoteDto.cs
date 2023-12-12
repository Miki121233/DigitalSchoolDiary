using System;

namespace API.Dtos;
public class NoteDto
{
    public int Id { get; set; }
    public string Description { get; set; }
    public bool IsPositive { get; set; }
    public int TeacherId { get; set; }
    public string TeacherFullName { get; set; }
    public DateTime Created { get; set; }
}