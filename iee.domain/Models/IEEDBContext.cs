using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace iee.domain.Models;

public partial class IEEDBContext : DbContext
{
    public IEEDBContext()
    {
    }

    public IEEDBContext(DbContextOptions<IEEDBContext> options)
        : base(options)
    {
    }

    public virtual DbSet<EventInfo> EventInfos { get; set; }

    public virtual DbSet<JudgeInfo> JudgeInfos { get; set; }

    public virtual DbSet<Store> Stores { get; set; }

    public virtual DbSet<StoreUrl> StoreUrls { get; set; }

    public virtual DbSet<User> Users { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EventInfo>(entity =>
        {
            entity.ToTable("eventInfo");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Cost)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("cost");
            entity.Property(e => e.DateOfEvent).HasColumnName("dateOfEvent");
            entity.Property(e => e.DayOfWeek).HasColumnName("dayOfWeek");
            entity.Property(e => e.EventType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("eventType");
            entity.Property(e => e.MeleeUrl)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("meleeUrl");
            entity.Property(e => e.Notes)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("notes");
            entity.Property(e => e.SignUpUrl)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("signUpUrl");
            entity.Property(e => e.StoreId).HasColumnName("storeId");
            entity.Property(e => e.TimeOfEvent).HasColumnName("timeOfEvent");
            entity.Property(e => e.Title)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("title");
        });

        modelBuilder.Entity<JudgeInfo>(entity =>
        {
            entity.ToTable("judgeInfo");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ContactMethod)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("contactMethod");
            entity.Property(e => e.Lat)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("lat");
            entity.Property(e => e.Long)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("long");
            entity.Property(e => e.PreferredName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("preferredName");
            entity.Property(e => e.Blurb)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("blurb");
            entity.Property(e => e.IsRoadWarrior).HasColumnName("isRoadWarrior");
            entity.Property(e => e.Range).HasColumnName("range");
        });

        modelBuilder.Entity<Store>(entity =>
        {
            entity.ToTable("stores");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("address");
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("city");
            entity.Property(e => e.Latitude)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("latitude");
            entity.Property(e => e.Longitude)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("longitude");
            entity.Property(e => e.Notes)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("notes");
            entity.Property(e => e.Phone)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.Region)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("region");
            entity.Property(e => e.SellsSingles).HasColumnName("sellsSingles");
            entity.Property(e => e.Storename)
                .HasMaxLength(75)
                .IsUnicode(false)
                .HasColumnName("storename");
        });

        modelBuilder.Entity<StoreUrl>(entity =>
        {
            entity.ToTable("storeURLs");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("storeId");
            entity.Property(e => e.Url)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("url");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IsSuperAdmin).HasColumnName("isSuperAdmin");
            entity.Property(e => e.PasswordHash)
                .IsUnicode(false)
                .HasColumnName("passwordHash");
            entity.Property(e => e.StoreOrganizer)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("storeOrganizer");
            entity.Property(e => e.Username)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
