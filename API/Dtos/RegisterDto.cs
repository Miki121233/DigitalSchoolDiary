using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class RegisterDto
{
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public string AccountType { get; set; }
    [Required]
    public string DateOfBirth { get; set; }
    [Required]
    public string Gender { get; set; }
}
