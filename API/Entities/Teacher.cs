using System.Collections.Generic;

namespace API.Entities;
public class Teacher : AppUser
{
    public Teacher()
    {
        AccountType = "Teacher";
    }
    public List<Event> Events { get; set; } = new();
}
