namespace API.Dtos;
public class UserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }
    public string AccountType { get; set; }
    public string Token { get; set; }
    public int ClassId { get; set; }
}