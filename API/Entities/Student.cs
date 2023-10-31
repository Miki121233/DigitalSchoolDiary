using System.Collections.Generic;

namespace API.Entities;
public class Student : AppUser 
{
    public Student()
    {
        AccountType = "Student";
    }
    public List<Parent> Parents { get; set; } = new();
    public int ClassId { get; set; }
    //public Class Class { get; set; } - circular error
}
