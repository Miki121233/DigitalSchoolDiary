using System.Collections.Generic;

namespace API.Dtos;
public class ParentDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }
    public string AccountType { get; set; }
    public List<StudentChildrenDto> StudentChildren { get; set; } = new();
}