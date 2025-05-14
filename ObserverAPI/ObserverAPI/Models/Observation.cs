using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class Observation
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Data> Datas { get; set; }
}

public class Data
{
    public DateTime SamplingTime { get; set; }
    public List<Property> Properties { get; set; }
}

public class Property
{
    public string Value { get; set; }
    public string Label { get; set; }
}
