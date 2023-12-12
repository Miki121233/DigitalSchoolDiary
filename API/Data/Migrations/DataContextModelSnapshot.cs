﻿// <auto-generated />
using System;
using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace API.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
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

            modelBuilder.Entity("API.Entities.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("AllDay")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ClassId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("CreatorId")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Editable")
                        .HasColumnType("INTEGER");

                    b.Property<string>("End")
                        .HasColumnType("TEXT");

                    b.Property<string>("EndHours")
                        .HasColumnType("TEXT");

                    b.Property<string>("EndRecur")
                        .HasColumnType("TEXT");

                    b.Property<bool>("RepeatWeekly")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Start")
                        .HasColumnType("TEXT");

                    b.Property<string>("StartHours")
                        .HasColumnType("TEXT");

                    b.Property<string>("StartRecur")
                        .HasColumnType("TEXT");

                    b.Property<int?>("TeacherId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ClassId");

                    b.HasIndex("TeacherId");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("API.Entities.Grade", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Date")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<int>("StudentId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("SubjectId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TeacherId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Value")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("StudentId");

                    b.HasIndex("SubjectId");

                    b.ToTable("Grades");
                });

            modelBuilder.Entity("API.Entities.Homework", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("ClassId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Comment")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Deadline")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsActive")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("PublishDate")
                        .HasColumnType("TEXT");

                    b.Property<int?>("SubjectId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TeacherId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("SubjectId");

                    b.ToTable("Homeworks");
                });

            modelBuilder.Entity("API.Entities.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DateRead")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("MessageSent")
                        .HasColumnType("TEXT");

                    b.Property<string>("RecipientFullName")
                        .HasColumnType("TEXT");

                    b.Property<int>("RecipientId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("SenderFullName")
                        .HasColumnType("TEXT");

                    b.Property<int>("SenderId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("RecipientId");

                    b.HasIndex("SenderId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("API.Entities.Note", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsPositive")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("StudentId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TeacherId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("StudentId");

                    b.ToTable("Notes");
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

            modelBuilder.Entity("API.Entities.Event", b =>
                {
                    b.HasOne("API.Entities.Class", null)
                        .WithMany("Events")
                        .HasForeignKey("ClassId");

                    b.HasOne("API.Entities.Teacher", null)
                        .WithMany("Events")
                        .HasForeignKey("TeacherId");
                });

            modelBuilder.Entity("API.Entities.Grade", b =>
                {
                    b.HasOne("API.Entities.Student", null)
                        .WithMany("Grades")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.Subject", "Subject")
                        .WithMany()
                        .HasForeignKey("SubjectId");

                    b.Navigation("Subject");
                });

            modelBuilder.Entity("API.Entities.Homework", b =>
                {
                    b.HasOne("API.Entities.Subject", "Subject")
                        .WithMany()
                        .HasForeignKey("SubjectId");

                    b.Navigation("Subject");
                });

            modelBuilder.Entity("API.Entities.Message", b =>
                {
                    b.HasOne("API.Entities.AppUser", "Recipient")
                        .WithMany("MessagesReceived")
                        .HasForeignKey("RecipientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.AppUser", "Sender")
                        .WithMany("MessagesSent")
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Recipient");

                    b.Navigation("Sender");
                });

            modelBuilder.Entity("API.Entities.Note", b =>
                {
                    b.HasOne("API.Entities.Student", null)
                        .WithMany("Notes")
                        .HasForeignKey("StudentId");
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

            modelBuilder.Entity("API.Entities.AppUser", b =>
                {
                    b.Navigation("MessagesReceived");

                    b.Navigation("MessagesSent");
                });

            modelBuilder.Entity("API.Entities.Class", b =>
                {
                    b.Navigation("Events");

                    b.Navigation("Students");

                    b.Navigation("Subjects");
                });

            modelBuilder.Entity("API.Entities.Student", b =>
                {
                    b.Navigation("Grades");

                    b.Navigation("Notes");
                });

            modelBuilder.Entity("API.Entities.Teacher", b =>
                {
                    b.Navigation("Events");
                });
#pragma warning restore 612, 618
        }
    }
}
