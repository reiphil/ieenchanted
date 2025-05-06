using System;
using System.Collections.Generic;

namespace iee.domain.Models;

public partial class User
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public bool IsSuperAdmin { get; set; }

    public string? StoreOrganizer { get; set; }
}
