using System.Collections.Generic;
namespace API.Dtos;
public class StudentGradesDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<GradeDto> Grades { get; set; } = new();
}