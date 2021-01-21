using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TradeZoneWeb_v1.Common;
using TradeZoneWeb_v1.Models;
using TradeZoneWeb_v1.Services.IService;

namespace TradeZoneWeb_v1.Controllers.AdminControllers
{
    [Authorize(Roles = Role.Admin)]
    public class AdminMapController : Controller
    {
        private readonly IAdminMapServices _iAdminMapService;
        public AdminMapController(IAdminMapServices iAdminMapService)
        {
            _iAdminMapService = iAdminMapService;
        }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> AddNew(CreateNewRequestModel request)
        {
            string jwt = Request.Cookies["jwtToken"];
            bool result = await _iAdminMapService.Add(request, jwt);
            return View(result);
        }
    }
}