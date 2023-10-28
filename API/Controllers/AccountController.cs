using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class AccountController : BaseApiController
{
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;

    public AccountController(DataContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")] // POST: api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

        using var hmac = new HMACSHA512();

        var user = new AppUser();

        switch (registerDto.AccountType)
        {
            case "Student":
                user = new Student
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Username = registerDto.Username.ToLower(),
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                    PasswordSalt = hmac.Key,
                    DateOfBirth = registerDto.DateOfBirth,
                    Gender = registerDto.Gender
                };
                break;
            case "Teacher":
                user = new Teacher
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Username = registerDto.Username.ToLower(),
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                    PasswordSalt = hmac.Key,
                    DateOfBirth = registerDto.DateOfBirth,
                    Gender = registerDto.Gender
                };
                break;
            default:
                return BadRequest("Wrong Account type");
        }

        _context.Add(user);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.Username,
            Token = _tokenService.CreateToken(user),
            AccountType = user.AccountType
        };
    } 

    [HttpPost("parentRegister")]
    public async Task<ActionResult<UserDto>> ParentRegister(ParentRegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

        using var hmac = new HMACSHA512();

        var user = new Parent
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Username = registerDto.Username.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key,
            DateOfBirth = registerDto.DateOfBirth,
            Gender = registerDto.Gender
        };

        var studentChildren = await _context.Students.FirstOrDefaultAsync(x => x.Username == registerDto.StudentChildrenUsername);
        user.StudentChildren.Add(studentChildren);

        _context.Parents.Add(user);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.Username,
            Token = _tokenService.CreateToken(user),
            AccountType = user.AccountType
        };
    } 

    [HttpPost("login")]  
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)  
    {
        var user = await _context.Users.SingleOrDefaultAsync(x => x.Username == loginDto.Username);

        if (user == null) return Unauthorized("Invalid username");

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedhash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedhash.Length; i++)
        {
            if (computedhash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
        }

        return new UserDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.Username,
            Token = _tokenService.CreateToken(user),
            AccountType = user.AccountType
        };
    }

    private async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(x => x.Username == username.ToLower());
    }
    
}