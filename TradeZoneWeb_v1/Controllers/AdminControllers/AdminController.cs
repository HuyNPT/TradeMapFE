using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeZoneWeb_v1.Common;

namespace TradeZoneWeb_v1.Controllers.AdminControllers
{
    [Authorize(Roles = Role.Admin)]
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}