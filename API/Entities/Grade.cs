namespace API.Entities;
public class Grade
{
    public int Id { get; set; }
    public string Description { get; set; }
    public int Value { get; set; }
    public int StudentId { get; set; }
}