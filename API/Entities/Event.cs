using System;

namespace API.Entities;
public class Event
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Start { get; set; }
    public string End { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string StartRecur { get; set; }
    public string EndRecur { get; set; }
    public bool RepeatWeekly { get; set; }
    public bool Editable { get; set; } = true;
    public bool AllDay { get; set; } = false;
    //to w Liscie nauczyciela
    //public int AssignedTeacherId { get; set; }
    public int CreatorId { get; set; }
}