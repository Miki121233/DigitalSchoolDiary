using System.Collections.Generic;

namespace API.Entities;
public class StudentGradesDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<Grade> Grades { get; set; } = new();
}