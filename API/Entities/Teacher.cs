using System.Collections.Generic;

namespace API.Entities;
public class Teacher : AppUser
{
    public Teacher()
    {
        AccountType = "Teacher";
    }
    public List<Class> Classes { get; set; } = new(); 
    // lepiej bedzie jak kazdy bedzie mial dostep do calosci klas (w przypadku zastępstwa byłyby inaczej problemy)
    // ale jednoczesnie bedzie mial przypisane klasy ktorych uczy
}
