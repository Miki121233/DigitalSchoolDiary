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
    public DbSet<Class> Classes { get; set; }
    public DbSet<Grade> Grades { get; set; }
    public DbSet<Subject> Subjects { get; set; }

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
            //opt.HasOne(x => x.Class).WithMany(x => x.Students).HasForeignKey(x => x.ClassId).OnDelete(DeleteBehavior.Restrict);
        });

        // builder.Entity<Teacher>(opt => {
        //     opt.HasMany(x => x.Students).WithMany(x => x.Teachers).UsingEntity(x => x.ToTable("StudentToTeacher"));
        // });

        builder.Entity<Class>(opt => {
            opt.HasMany(x => x.Teachers).WithMany(x => x.Classes).UsingEntity(x => x.ToTable("TeacherToClass"));
           // opt.HasMany(x => x.Students).WithOne(x => x.Class).HasForeignKey(x => x.ClassId);
        });

        builder.Entity<Subject>(opt =>{
            
        });
    }
}
