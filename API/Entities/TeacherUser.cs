using System.Collections.Generic;

namespace API.Entities;
public class TeacherUser : AppUser
{
    public IEnumerable<StudentUser> Students { get; set; }
    public IEnumerable<Class> Classes { get; set; }
    public new string AccountType { get; set; } = "TeacherUser";
}
