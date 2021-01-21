using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TradeZoneWeb_v1.Services.Requests;

namespace TradeZoneWeb_v1.Services.Service
{
    public class UserService : IUserServices
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public UserService(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        public async Task<string> Authenticate(string token)
        {
            AuthenticateAccount req = new AuthenticateAccount
            {
                IdToken = token,
                FcmToken = "string"
            };
            var json = JsonConvert.SerializeObject(req);
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseUrl"]);
            var response = await client.PostAsync(_config["api-v"] + "/accounts/authenticate", httpContent);
            if (response.StatusCode == HttpStatusCode.InternalServerError)
            {
                return "Server Error";
            }
            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return "Unauthorized";
            }
            var jwt = await response.Content.ReadAsStringAsync();
            return jwt;
        }

        public async Task<bool> JwtVerify(String jwtToken)
        {
            VerifyJwt req = new VerifyJwt
            {
                Jwt = jwtToken
            };
            var json = JsonConvert.SerializeObject(req);
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseUrl"]);
            var response = await client.PostAsync(_config["api-v"] + "/accounts/verify-jwt", httpContent);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                return true;
            }
            return false;
        }
    }
}