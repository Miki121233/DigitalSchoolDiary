using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class ClassDto
{
    [Required]
    [Range(1,9)]
    public int Year { get; set; } // 2
    [Required]
    public string ClassLetterId { get; set; } // b
}