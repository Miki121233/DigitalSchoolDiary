using System.Collections.Generic;

namespace API.Entities;
public class Calendar
{
    public int Id { get; set; }
    public string Title { get; set; }
    public List<Event> Events { get; set; } = new();
}