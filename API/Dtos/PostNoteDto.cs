using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class PostNoteDto
{
    [Required]
    [MinLength(4)]
    public string Description { get; set; }
    [Required]
    public bool IsPositive { get; set; }
    [Required]
    public int TeacherId { get; set; }
}