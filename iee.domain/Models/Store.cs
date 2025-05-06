using System;
using System.Collections.Generic;

namespace iee.domain.Models;

public partial class Store
{
    public int Id { get; set; }

    public string Region { get; set; } = null!;

    public string Storename { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string? Phone { get; set; }

    public string City { get; set; } = null!;

    public bool SellsSingles { get; set; }

    public string? Notes { get; set; }

    public string? Latitude { get; set; }

    public string? Longitude { get; set; }
}
