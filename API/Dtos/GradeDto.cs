using System;

namespace API.Dtos;
public class GradeDto
{
    public int Id { get; set; }
    public string Description { get; set; }
    public int Value { get; set; }
    public int StudentId { get; set; }
    public int TeacherId { get; set; }
    public string TeacherFullName { get; set; }
    public DateTime Date { get; set; }
}