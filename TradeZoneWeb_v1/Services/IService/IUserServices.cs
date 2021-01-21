using System;
using System.Threading.Tasks;

namespace TradeZoneWeb_v1.Services
{
    public interface IUserServices
    {
        Task<string> Authenticate(String token);

        Task<bool> JwtVerify(String jwtToken);
    }
}