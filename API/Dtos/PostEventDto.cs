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
    public string StartTime { get; set; }
    [Required]
    public string EndTime { get; set; }
    public string StartRecur { get; set; }
    public string EndRecur { get; set; }
    [Required]
    public bool RepeatWeekly { get; set; }
    [Required]
    public bool Editable { get; set; }
    public bool AllDay { get; set; }
    public int AssignedPersonId { get; set; }
    [Required]
    public int CreatorId { get; set; }
}