using System.Collections.Generic;

namespace API.Entities;
public class Class
{
    public string Id { get; set; }
    public string SchoolId => SchoolIdCalculation(); // 2+b = 2b
    public string Year { get; set; } // 2
    public string ClassId { get; set; } // b
    public List<Teacher> Teachers { get; set; } = new();
    public List<Student> Students { get; set; } = new();

    private string SchoolIdCalculation() {
        return Year + ClassId;
    }
}
