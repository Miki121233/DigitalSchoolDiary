using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class PostEventDto
{
    [Required]
    public string Title { get; set; }
    [Required]
    public string Start { get; set; }
    public string End { get; set; }
    [Required]
    public string StartHours { get; set; }
    [Required]
    public string EndHours { get; set; }
    public string StartRecur { get; set; }
    public string EndRecur { get; set; }
    [Required]
    public bool RepeatWeekly { get; set; }
    [Required]
    public bool Editable { get; set; }
    public bool AllDay { get; set; }
    public int AssignedTeacherId { get; set; }
    [Required]
    public int CreatorId { get; set; }
}