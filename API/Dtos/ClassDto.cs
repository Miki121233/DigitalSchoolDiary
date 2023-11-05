using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class ClassDto
{
    [Required]
    public int Year { get; set; } // 2
    [Required]
    public string ClassLetterId { get; set; } // b
}