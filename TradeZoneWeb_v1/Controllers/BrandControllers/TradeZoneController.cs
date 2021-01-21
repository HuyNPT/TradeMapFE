using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TradeZoneWeb_v1.Common;
using TradeZoneWeb_v1.Services.IService;

namespace TradeZoneWeb_v1.Controllers
{
    [Authorize(Roles = Role.Brand)]
    public class TradeZoneController : Controller
    {
        private readonly ICategoryServices _iCategoryServices;

        public TradeZoneController(ICategoryServices iCategoryServices)
        {
            _iCategoryServices = iCategoryServices;
        }

        public async Task<IActionResult> Index()
        {
            string jwt = Request.Cookies["jwtToken"];
            var result = await _iCategoryServices.GetAllCategory(jwt);
            return View(result);
        }
    }
}