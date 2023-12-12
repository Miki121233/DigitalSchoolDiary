using System.Collections.Generic;

namespace API.Dtos;
public class StudentNotesDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<NoteDto> Notes { get; set; } = new();
}

