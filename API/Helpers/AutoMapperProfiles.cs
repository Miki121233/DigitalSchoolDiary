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
        CreateMap<Message, MessageDto>()
            .ForMember(x => x.SenderAccountType, x => x.MapFrom(x => x.Sender.AccountType))
            .ForMember(x => x.RecipientAccountType, x => x.MapFrom(x => x.Recipient.AccountType));
        CreateMap<Note, NoteDto>();
        CreateMap<Student, StudentNotesDto>();

    }
}