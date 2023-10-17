using System.Collections.Generic;

namespace API.Entities;
public class Class
{
    public string Id { get; set; }
    public string SchoolId => SchoolIdCalculation(); // 2+b = 2b
    public string Year { get; set; } // 2
    public string ClassId { get; set; } // b
    public IEnumerable<Teacher> Teachers { get; set; }
    public IEnumerable<Student> Students { get; set; }

    private string SchoolIdCalculation() {
        return Year + ClassId;
    }
}
