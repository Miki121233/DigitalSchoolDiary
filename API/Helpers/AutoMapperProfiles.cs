using API.Dtos;
using API.Entities;
using AutoMapper;

namespace API.Helpers;
public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDto>();
        CreateMap<PostEventDto, Event>();
        CreateMap<ChangeEventDto, Event>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<Event, EventDtoForClass>(); //assignedTeacherId osobno
        CreateMap<Event, EventDtoForTeacher>();
        CreateMap<Grade, GradeDto>();
        CreateMap<Homework, HomeworkDto>();


    }
}