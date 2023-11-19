using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class PostHomeworkDto
{ 
    [Required]
    public string Description { get; set; }
    public string Comment { get; set; }
    [Required]
    public int TeacherId { get; set; }
    // DateTime PublishDate { get; set; } = DateTime.UtcNow;
    //[Required]
    public DateTime Deadline { get; set; }
    [Required]
    public int SubjectId { get; set; }
}