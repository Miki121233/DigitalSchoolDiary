namespace API.Dtos;
public class ChangeEventDto
{  
    public string Title { get; set; }
    public string Start { get; set; }
    public string End { get; set; }
    public string StartHours { get; set; }
    public string EndHours { get; set; }
    public string StartRecur { get; set; }
    public string EndRecur { get; set; }
    public bool RepeatWeekly { get; set; }
    public bool Editable { get; set; }
    public bool AllDay { get; set; }
    public int AssignedTeacherId { get; set; }
}