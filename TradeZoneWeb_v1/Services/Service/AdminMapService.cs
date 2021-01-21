using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TradeZoneWeb_v1.Helpers;
using TradeZoneWeb_v1.Models;
using TradeZoneWeb_v1.Services.IService;
using TradeZoneWeb_v1.Services.Requests;

namespace TradeZoneWeb_v1.Services.Service
{
    public class AdminMapService : IAdminMapServices
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;
        public AdminMapService(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
        }
        public async Task<bool> Add(CreateNewRequestModel request, string jwt)
        {
            if(request.Type.Equals("systemZone"))
            {
                var tmp =Helper.FormatToGeoJson(Helper.ParseStringToGeoMetry(request.Wkt));
                AddNewSystemZone req = new AddNewSystemZone()
                {
                    Name = request.Name,
                    Geom = tmp,
                    WardId = request.WardId
                };
                var json = JsonConvert.SerializeObject(req);
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri(_config["BaseUrl"]);
                var response = await client.PostAsync(_config["api-v"] + "/accounts/authenticate", httpContent);
                if(response.StatusCode == HttpStatusCode.OK)
                {
                    return true;
                }
            }
            else if(request.Type.Equals("campus"))
            {

            }else if(request.Type.Equals("streetSeqment"))
            {

            }
            return false;
        }
    }
}
