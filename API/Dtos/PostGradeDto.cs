using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class PostGradeDto
{
    [Required]
    public string Description { get; set; }
    [Required]
    [Range(1,6)]
    public int Value { get; set; }
    [Required]
    public string Subject { get; set; }
    [Required]
    public int TeacherId { get; set; }
}