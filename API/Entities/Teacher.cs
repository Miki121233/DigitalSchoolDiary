using System.Collections.Generic;

namespace API.Entities;
public class Teacher : AppUser
{
    public Teacher()
    {
        AccountType = "Teacher";
    }
    public List<Class> Classes { get; set; } = new();
}
