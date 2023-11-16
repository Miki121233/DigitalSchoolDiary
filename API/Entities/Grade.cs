using System;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Entities;
public class Grade
{
    public int Id { get; set; }
    public string Description { get; set; }
    public int Value { get; set; }
    public int StudentId { get; set; }
    public Subject Subject { get; set; }
    public int TeacherId { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
}