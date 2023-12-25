using System;

namespace API.Entities;
public class Event
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Start { get; set; }
    public string End { get; set; }
    public string StartHours { get; set; }
    public string EndHours { get; set; }
    public string StartRecur { get; set; }
    public string EndRecur { get; set; }
    public bool RepeatWeekly { get; set; }
    public bool Editable { get; set; } = true;
    public bool AllDay { get; set; } = false;
    public int CreatorId { get; set; }
}