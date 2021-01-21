using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TradeZoneWeb_v1.Models;

namespace TradeZoneWeb_v1.Services.IService
{
    public interface IAdminMapServices
    {
        Task<bool> Add(CreateNewRequestModel request, string jwt);
    }
}
