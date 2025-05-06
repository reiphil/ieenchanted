using System;
using System.Collections.Generic;

namespace iee.domain.Models;

public partial class EventInfo
{
    public int Id { get; set; }

    public string EventType { get; set; } = null!;

    public int DayOfWeek { get; set; }

    public TimeOnly TimeOfEvent { get; set; }

    public DateOnly? DateOfEvent { get; set; }

    public int StoreId { get; set; }

    public string MeleeUrl { get; set; } = null!;

    public string SignUpUrl { get; set; } = null!;

    public string Cost { get; set; } = null!;

    public string Notes { get; set; } = null!;

    public string Title { get; set; } = null!;
}
