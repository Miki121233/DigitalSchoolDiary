namespace API.Dtos;
public class MemberDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }    
    public string AccountType { get; set; }
    public string DateOfBirth { get; set; }
    public string Gender { get; set; }
    public int ClassId { get; set; }
}
