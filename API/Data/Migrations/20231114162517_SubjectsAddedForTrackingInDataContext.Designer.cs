﻿// <auto-generated />
using System;
using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace API.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20231114162517_SubjectsAddedForTrackingInDataContext")]
    partial class SubjectsAddedForTrackingInDataContext
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
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("DateOfBirth")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("Gender")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("PasswordHash")
                        .HasColumnType("BLOB");

                    b.Property<byte[]>("PasswordSalt")
                        .HasColumnType("BLOB");

                    b.Property<string>("Username")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.HasDiscriminator<string>("AccountType").HasValue("AppUser");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("API.Entities.Class", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ClassLetterId")
                        .HasColumnType("TEXT");

                    b.Property<int>("Year")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Classes");
                });

            modelBuilder.Entity("API.Entities.Grade", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<int>("StudentId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Subject")
                        .HasColumnType("TEXT");

                    b.Property<string>("TeacherFirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("TeacherLastName")
                        .HasColumnType("TEXT");

                    b.Property<int>("Value")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("StudentId");

                    b.ToTable("Grades");
                });

            modelBuilder.Entity("API.Entities.Subject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ClassId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ClassId");

                    b.ToTable("Subjects");
                });

            modelBuilder.Entity("ClassTeacher", b =>
                {
                    b.Property<int>("ClassesId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TeachersId")
                        .HasColumnType("INTEGER");

                    b.HasKey("ClassesId", "TeachersId");

                    b.HasIndex("TeachersId");

                    b.ToTable("TeacherToClass", (string)null);
                });

            modelBuilder.Entity("ParentStudent", b =>
                {
                    b.Property<int>("ParentsId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("StudentChildrenId")
                        .HasColumnType("INTEGER");

                    b.HasKey("ParentsId", "StudentChildrenId");

                    b.HasIndex("StudentChildrenId");

                    b.ToTable("StudentToParent", (string)null);
                });

            modelBuilder.Entity("API.Entities.Parent", b =>
                {
                    b.HasBaseType("API.Entities.AppUser");

                    b.HasDiscriminator().HasValue("Parent");
                });

            modelBuilder.Entity("API.Entities.Student", b =>
                {
                    b.HasBaseType("API.Entities.AppUser");

                    b.Property<int>("ClassId")
                        .HasColumnType("INTEGER");

                    b.HasIndex("ClassId");

                    b.HasDiscriminator().HasValue("Student");
                });

            modelBuilder.Entity("API.Entities.Teacher", b =>
                {
                    b.HasBaseType("API.Entities.AppUser");

                    b.HasDiscriminator().HasValue("Teacher");
                });

            modelBuilder.Entity("API.Entities.Grade", b =>
                {
                    b.HasOne("API.Entities.Student", null)
                        .WithMany("Grades")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("API.Entities.Subject", b =>
                {
                    b.HasOne("API.Entities.Class", null)
                        .WithMany("Subjects")
                        .HasForeignKey("ClassId");
                });

            modelBuilder.Entity("ClassTeacher", b =>
                {
                    b.HasOne("API.Entities.Class", null)
                        .WithMany()
                        .HasForeignKey("ClassesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.Teacher", null)
                        .WithMany()
                        .HasForeignKey("TeachersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ParentStudent", b =>
                {
                    b.HasOne("API.Entities.Parent", null)
                        .WithMany()
                        .HasForeignKey("ParentsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.Student", null)
                        .WithMany()
                        .HasForeignKey("StudentChildrenId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("API.Entities.Student", b =>
                {
                    b.HasOne("API.Entities.Class", null)
                        .WithMany("Students")
                        .HasForeignKey("ClassId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("API.Entities.Class", b =>
                {
                    b.Navigation("Students");

                    b.Navigation("Subjects");
                });

            modelBuilder.Entity("API.Entities.Student", b =>
                {
                    b.Navigation("Grades");
                });
#pragma warning restore 612, 618
        }
    }
}
