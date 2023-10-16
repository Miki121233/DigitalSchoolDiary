using System.Collections;
using System.Collections.Generic;

namespace API.Entities;
public class ParentUser : AppUser
{
    public IEnumerable<StudentUser> StudentChildren { get; set; }
    public new string AccountType { get; set; } = "ParentUser";
}
