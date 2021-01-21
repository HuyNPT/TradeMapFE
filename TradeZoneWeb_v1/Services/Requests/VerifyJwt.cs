using System.ComponentModel.DataAnnotations;

namespace TradeZoneWeb_v1.Services.Requests
{
    public class VerifyJwt
    {
        [Required]
        public string Jwt { get; set; }
    }
}