using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class GradeDto
{
    [Required]
    public string Description { get; set; }
    [Required]
    [Range(1,6)]
    public int Value { get; set; }
}