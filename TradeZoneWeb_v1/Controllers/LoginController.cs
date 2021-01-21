using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;
using TradeZoneWeb_v1.Helpers;
using TradeZoneWeb_v1.Models;
using TradeZoneWeb_v1.Services;

namespace TradeZoneWeb_v1.Controllers
{   
    public class LoginController : Controller
    {
        private readonly IUserServices _iUserService;
        private readonly IConfiguration _iConfiguration;

        public LoginController(IUserServices iUserService, IConfiguration iConfiguration)
        {
            _iUserService = iUserService;
            _iConfiguration = iConfiguration;
        }

        public async Task<IActionResult> Index()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return View();
        }

        public async Task<IActionResult> Login(GoogleResponseModel res)
        {
            var rs = await _iUserService.Authenticate(res.Token);
            if (rs == "Unauthorized")
            {
                return Content("Unauthorized");
            }

            if (await _iUserService.JwtVerify(rs))
            {
                var userPrincipal = ValidateToken.Validate(rs, _iConfiguration);

                AccountModel account = new AccountModel()
                {
                    Id = userPrincipal.Claims.ToArray()[0].Value,
                    Role = userPrincipal.Claims.ToArray()[1].Value,
                    Name = userPrincipal.Claims.ToArray()[2].Value,
                    Email = userPrincipal.Claims.ToArray()[3].Value,
                    FcmToken = userPrincipal.Claims.ToArray()[4].Value,
                    BrandName = userPrincipal.Claims.ToArray()[7].Value
                };

                var authProperties = new AuthenticationProperties
                {
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60),
                    IsPersistent = true
                };
                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    userPrincipal,
                    authProperties);

                HttpContext.Session.SetString("Token", rs);
                SetCookie("jwtToken", rs, 60);

                if (account.Role.Equals("1") && string.IsNullOrEmpty(account.BrandName))
                {
                    return RedirectToAction("Index", "Brand");
                }
                else if (account.Role.Equals("0"))
                {
                    return RedirectToAction("Index", "Admin");
                }
            }

            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> Logout()
        {
            HttpContext.Session.Clear();
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Login");
        }

        public void SetCookie(string key, string value, int? expireTime)
        {
            CookieOptions option = new CookieOptions();
            if (expireTime.HasValue)
                option.Expires = DateTime.Now.AddMinutes(expireTime.Value);
            else
                option.Expires = DateTime.Now.AddMilliseconds(10);
            Response.Cookies.Append(key, value, option);
        }
    }
}