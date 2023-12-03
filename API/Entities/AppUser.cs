using System.Collections.Generic;

namespace API.Entities;
public class AppUser
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }
    public byte[] PasswordHash { get; set; }

    public byte[] PasswordSalt { get; set; }
    public string AccountType { get; set; } = "undefined";
    public string DateOfBirth { get; set; }
    public string Gender { get; set; }
    public List<Message> MessagesSent { get; set; } = new();
    public List<Message> MessagesReceived { get; set; } = new();
}
