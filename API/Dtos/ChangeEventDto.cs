namespace API.Dtos;
public class ChangeEventDto
{  
    public string Title { get; set; }
    public string Start { get; set; }
    public string End { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string StartRecur { get; set; }
    public string EndRecur { get; set; }
    public bool RepeatWeekly { get; set; }
    public bool Editable { get; set; }
    public bool AllDay { get; set; }
    public int AssignedPersonId { get; set; }
}