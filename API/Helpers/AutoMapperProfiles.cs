using API.Dtos;
using API.Entities;
using AutoMapper;

namespace API.Helpers;
public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDto>();

        // CreateMap<Teacher, UserDto>();
        // CreateMap<Parent, UserDto>();
        // CreateMap<Student, UserDto>();
    }
}