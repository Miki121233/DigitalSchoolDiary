using System;

namespace API.Dtos;
public class HomeworkDto
{
    public int Id { get; set; }
    public string Description { get; set; }
    public string Comment { get; set; }
    public int TeacherId { get; set; }
    public string TeacherFullName { get; set; }
    public DateTime PublishDate { get; set; }
    public DateTime Deadline { get; set; }
}