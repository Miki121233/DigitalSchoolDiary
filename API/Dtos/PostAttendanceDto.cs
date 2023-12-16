using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class PostAttendanceDto
{
    [Required]
    public string Description { get; set; }
    [Required]
    public bool Value { get; set; }
    [Required]
    public string Subject { get; set; }
    [Required]
    public int TeacherId { get; set; }
}