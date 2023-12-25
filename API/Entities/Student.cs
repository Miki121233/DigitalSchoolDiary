using System.Collections.Generic;

namespace API.Entities;
public class Student : AppUser 
{
    public Student()
    {
        AccountType = "Student";
    }
    public List<Parent> Parents { get; set; } = new();
    public int? ClassId { get; set; } = null;
    public List<Grade> Grades { get; set; } = new();
    public List<Attendance> Attendances { get; set; } = new();
    public List<Note> Notes { get; set; } = new();
}
