using System.Collections;
using System.Collections.Generic;

namespace API.Entities;
public class Parent : AppUser
{
    public Parent()
    {
        AccountType = "Parent";
    }
    public List<Student> StudentChildren { get; set; } = new();
}
