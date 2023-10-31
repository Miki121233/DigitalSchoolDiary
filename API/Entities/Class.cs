using System.Collections.Generic;

namespace API.Entities;
public class Class
{
    public int Id { get; set; }
    public string SchoolId => SchoolIdCalculation(); // 2+b = 2b
    public int Year { get; set; } // 2
    public string ClassLetterId { get; set; } // b
    public List<Teacher> Teachers { get; set; } = new();
    public List<Student> Students { get; set; } = new();

    private string SchoolIdCalculation() {
        return Year.ToString() + ClassLetterId;
    }
}
