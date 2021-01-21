using NetTopologySuite.Geometries;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TradeZoneWeb_v1.Services.Requests
{
    public class AddNewSystemZone
    {
        public string Name { get; set; }
        [Newtonsoft.Json.JsonConverter(typeof(NetTopologySuite.IO.Converters.GeometryConverter))]
        public JObject Geom { get; set; }
        public int WardId { get; set; }
    }
}
