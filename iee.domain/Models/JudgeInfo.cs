using System;
using System.Collections.Generic;

namespace iee.domain.Models;

public partial class JudgeInfo
{
    public int Id { get; set; }

    public string PreferredName { get; set; } = null!;

    public string? ContactMethod { get; set; }

    public string Lat { get; set; } = null!;

    public string Long { get; set; } = null!;

    public string? Blurb { get; set; }

    public bool IsRoadWarrior { get; set; }

    public int Range { get; set; }
}
