using System.Collections.Generic;

namespace API.Entities;
public class Teacher : AppUser
{
    public IEnumerable<Student> Students { get; set; }
    public IEnumerable<Class> Classes { get; set; }
    public new string AccountType { get; set; } = "Teacher";
}
