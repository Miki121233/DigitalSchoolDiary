using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class SubjectDto
{
    [Required]
    [MinLength(3)]
    public string Name { get; set; }
}