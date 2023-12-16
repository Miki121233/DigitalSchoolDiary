using System.Collections.Generic;

namespace API.Dtos;
public class StudentAttendancesDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<AttendanceDto> Attendances { get; set; } = new();
}