using System;

namespace API.Entities;
public class Attendance
{
    public int Id { get; set; }
    public string Description { get; set; }
    public bool Value { get; set; }
    public int StudentId { get; set; }
    public Subject Subject { get; set; }
    public int TeacherId { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
}