using System;

namespace API.Entities;
public class Homework
{
    public int Id { get; set; }
    public string Description { get; set; }
    public string Comment { get; set; }
    public int TeacherId { get; set; }
    public int ClassId { get; set; }
    public DateTime PublishDate { get; set; } = DateTime.UtcNow;
    public DateTime Deadline { get; set; }
    public bool IsActive { get; set; } = true;
    public Subject Subject { get; set; }
}