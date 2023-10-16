using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;
public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
        
    }


    public DbSet<AppUser> Users { get; set; }
    public DbSet<ParentUser> ParentUsers { get; set; }
    public DbSet<StudentUser> StudentUsers { get; set; }
    public DbSet<TeacherUser> TeacherUsers { get; set; }
    public DbSet<Class> Classes { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<ParentUser>(opt => {
            opt.HasMany(x => x.StudentChildren).WithMany(x => x.Parents).UsingEntity(x => x.ToTable("StudentToParent"));
        });

        builder.Entity<StudentUser>(opt => {
            opt.HasMany(x => x.Parents).WithMany(x => x.StudentChildren);
            opt.HasOne(x => x.Class).WithMany(x => x.Students).HasForeignKey(x => x.ClassId).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<TeacherUser>(opt => {
            opt.HasMany(x => x.Students).WithMany(x => x.Teachers).UsingEntity(x => x.ToTable("StudentToTeacher"));
        });

        builder.Entity<Class>(opt => {
            opt.HasMany(x => x.Teachers).WithMany(x => x.Classes).UsingEntity(x => x.ToTable("TeacherToClass"));
        });
    }
}
