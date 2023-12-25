using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class SubjectDto
{
    [Required]
    [MinLength(2)]
    public string Name { get; set; }
}