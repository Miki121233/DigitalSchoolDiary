using System;

namespace API.Entities;
public class Note
{
    public int Id { get; set; }
    public string Description { get; set; }
    public bool IsPositive { get; set; }
    public int TeacherId { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
}