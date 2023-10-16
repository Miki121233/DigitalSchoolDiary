using System.Collections.Generic;

namespace API.Entities;
public class StudentUser : AppUser 
{
    public IEnumerable<ParentUser> Parents { get; set; }
    public IEnumerable<TeacherUser> Teachers { get; set; }
    public string ClassId { get; set; }
    public Class Class { get; set; }
    public new string AccountType { get; set; } = "StudentUser";
}
