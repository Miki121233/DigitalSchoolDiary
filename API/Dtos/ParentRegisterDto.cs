using System.ComponentModel.DataAnnotations;

namespace API.Dtos;
public class ParentRegisterDto
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
    public string DateOfBirth { get; set; }
    [Required]
    public string Gender { get; set; }
    [Required]
    public string StudentChildrenUsername { get; set; }
}