using System.Collections;
using System.Collections.Generic;

namespace API.Entities;
public class Parent : AppUser
{
    public IEnumerable<Student> StudentChildren { get; set; }
    public new string AccountType { get; set; } = "Parent";
}
