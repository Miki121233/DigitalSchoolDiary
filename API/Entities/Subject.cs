using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace API.Entities;
public class Subject
{
    public int Id { get; set; } //potem moze usunac
    public string Name { get; set; }
    [JsonIgnore]
    public List<Class> Classes { get; set; } = new();
}