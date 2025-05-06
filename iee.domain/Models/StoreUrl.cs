using System;
using System.Collections.Generic;

namespace iee.domain.Models;

public partial class StoreUrl
{
    public int Id { get; set; }

    public int StoreId { get; set; }

    public string Url { get; set; } = null!;
}
