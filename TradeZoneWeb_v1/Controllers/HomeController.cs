using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Diagnostics;
using System.Linq;
using TradeZoneWeb_v1.Common;
using TradeZoneWeb_v1.Helpers;
using TradeZoneWeb_v1.Models;

namespace TradeZoneWeb_v1.Controllers
{
    public class HomeController : Controller
    {
#pragma warning disable IDE0052 // Remove unread private members
        //private readonly ILogger<HomeController> _logger;
#pragma warning restore IDE0052 // Remove unread private members
        private readonly IConfiguration _iConfiguration;

        public HomeController(/*ILogger<HomeController> logger*/IConfiguration iConfiguration)
        {
            //_logger = logger;
            _iConfiguration = iConfiguration;
        }

        public IActionResult Index()
        {
            string jwt = Request.Cookies["jwtToken"];
            if(!string.IsNullOrEmpty(jwt))
            {
                var userPrincipal = ValidateToken.Validate(jwt, _iConfiguration);
                string role = userPrincipal.Claims.ToArray()[1].Value;
                if(role.Equals(Role.Admin))
                {
                    return RedirectToAction("Index", "Admin");
                } else if(role.Equals(Role.Brand))
                {
                    return RedirectToAction("Index", "Dashboard");
                }
            }
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}