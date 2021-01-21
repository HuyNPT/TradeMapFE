using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeZoneWeb_v1.Common;

namespace TradeZoneWeb_v1.Controllers
{
    [Authorize(Roles = Role.Brand)]
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}