using System.Collections.Generic;

namespace API.Entities;
public class Student : AppUser 
{
    public IEnumerable<Parent> Parents { get; set; }
    public string ClassId { get; set; }
    public Class Class { get; set; }
    public new string AccountType { get; set; } = "Student";
}
