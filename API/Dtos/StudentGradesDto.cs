using System.Collections.Generic;
using API.Dtos;

namespace API.Entities;
public class StudentGradesDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<GradeDto> Grades { get; set; } = new();
}