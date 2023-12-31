using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;
public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
        
    }

    public DbSet<AppUser> Users { get; set; }
    public DbSet<Parent> Parents { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<Director> Directors { get; set; }
    public DbSet<Class> Classes { get; set; }
    public DbSet<Grade> Grades { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<Homework> Homeworks { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Note> Notes { get; set; }
    public DbSet<Calendar> Calendars { get; set; }
    public DbSet<Attendance> Attendances { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>()
        .HasDiscriminator<string>("AccountType")
        .HasValue<Student>("Student")
        .HasValue<Teacher>("Teacher")
        .HasValue<Parent>("Parent");

        builder.Entity<Parent>(opt => {
            opt.HasMany(x => x.StudentChildren).WithMany(x => x.Parents).UsingEntity(x => x.ToTable("StudentToParent"));
        });

        builder.Entity<Student>(opt => {
            opt.HasMany(x => x.Parents).WithMany(x => x.StudentChildren);
        });

        builder.Entity<Class>(opt => {
            opt.HasMany(c => c.Subjects)
                .WithMany(s => s.Classes)
                .UsingEntity(j => j.ToTable("ClassSubjects"));
        });

        builder.Entity<Message>(opt =>{
            opt.HasOne(u => u.Recipient).WithMany(m => m.MessagesReceived);
            opt.HasOne(u => u.Sender).WithMany(m => m.MessagesSent);
        });
    }
}
