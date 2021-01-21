using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using TradeZoneWeb_v1.Models;
using TradeZoneWeb_v1.Services.IService;

namespace TradeZoneWeb_v1.Services.Service
{
    public class CategoryService : ICategoryServices
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public CategoryService(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        public async Task<List<CategoryModel>> GetAllCategory(string jwt)
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(_config["BaseUrl"]);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwt);
            var response = await client.GetAsync(_config["api-v"] + "/categories");
            var body = await response.Content.ReadAsStringAsync();
            var listCategory = JsonConvert.DeserializeObject<List<CategoryModel>>(body);
            return listCategory;
        }
    }
}