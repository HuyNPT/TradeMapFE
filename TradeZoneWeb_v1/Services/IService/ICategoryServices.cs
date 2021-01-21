using System.Collections.Generic;
using System.Threading.Tasks;
using TradeZoneWeb_v1.Models;

namespace TradeZoneWeb_v1.Services.IService
{
    public interface ICategoryServices
    {
        Task<List<CategoryModel>> GetAllCategory(string jwt);
    }
}