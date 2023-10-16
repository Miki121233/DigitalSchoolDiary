﻿// <auto-generated />
using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace API.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20231016194935_AppUsersDescribed")]
    partial class AppUsersDescribed
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "7.0.12");

            modelBuilder.Entity("API.Entities.AppUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AccountType")
                        .HasColumnType("TEXT");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Gender")
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("PasswordHash")
                        .HasColumnType("BLOB");

                    b.Property<byte[]>("PasswordSalt")
                        .HasColumnType("BLOB");

                    b.Property<string>("Username")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.HasDiscriminator<string>("Discriminator").HasValue("AppUser");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("API.Entities.Class", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<string>("ClassId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Year")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Classes");
                });

            modelBuilder.Entity("ClassTeacherUser", b =>
                {
                    b.Property<string>("ClassesId")
                        .HasColumnType("TEXT");

                    b.Property<int>("TeachersId")
                        .HasColumnType("INTEGER");

                    b.HasKey("ClassesId", "TeachersId");

                    b.HasIndex("TeachersId");

                    b.ToTable("TeacherToClass", (string)null);
                });

            modelBuilder.Entity("ParentUserStudentUser", b =>
                {
                    b.Property<int>("ParentsId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("StudentChildrenId")
                        .HasColumnType("INTEGER");

                    b.HasKey("ParentsId", "StudentChildrenId");

                    b.HasIndex("StudentChildrenId");

                    b.ToTable("StudentToParent", (string)null);
                });

            modelBuilder.Entity("StudentUserTeacherUser", b =>
                {
                    b.Property<int>("StudentsId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TeachersId")
                        .HasColumnType("INTEGER");

                    b.HasKey("StudentsId", "TeachersId");

                    b.HasIndex("TeachersId");

                    b.ToTable("StudentToTeacher", (string)null);
                });

            modelBuilder.Entity("API.Entities.ParentUser", b =>
                {
                    b.HasBaseType("API.Entities.AppUser");

                    b.HasDiscriminator().HasValue("ParentUser");
                });

            modelBuilder.Entity("API.Entities.StudentUser", b =>
                {
                    b.HasBaseType("API.Entities.AppUser");

                    b.Property<string>("ClassId")
                        .HasColumnType("TEXT");

                    b.HasIndex("ClassId");

                    b.HasDiscriminator().HasValue("StudentUser");
                });

            modelBuilder.Entity("API.Entities.TeacherUser", b =>
                {
                    b.HasBaseType("API.Entities.AppUser");

                    b.HasDiscriminator().HasValue("TeacherUser");
                });

            modelBuilder.Entity("ClassTeacherUser", b =>
                {
                    b.HasOne("API.Entities.Class", null)
                        .WithMany()
                        .HasForeignKey("ClassesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.TeacherUser", null)
                        .WithMany()
                        .HasForeignKey("TeachersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ParentUserStudentUser", b =>
                {
                    b.HasOne("API.Entities.ParentUser", null)
                        .WithMany()
                        .HasForeignKey("ParentsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.StudentUser", null)
                        .WithMany()
                        .HasForeignKey("StudentChildrenId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("StudentUserTeacherUser", b =>
                {
                    b.HasOne("API.Entities.StudentUser", null)
                        .WithMany()
                        .HasForeignKey("StudentsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.TeacherUser", null)
                        .WithMany()
                        .HasForeignKey("TeachersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("API.Entities.StudentUser", b =>
                {
                    b.HasOne("API.Entities.Class", "Class")
                        .WithMany("Students")
                        .HasForeignKey("ClassId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Class");
                });

            modelBuilder.Entity("API.Entities.Class", b =>
                {
                    b.Navigation("Students");
                });
#pragma warning restore 612, 618
        }
    }
}
