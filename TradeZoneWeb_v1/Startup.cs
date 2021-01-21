using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System;
using TradeMap.API.Helpers;
using TradeZoneWeb_v1.Services;
using TradeZoneWeb_v1.Services.IService;
using TradeZoneWeb_v1.Services.Service;

namespace TradeZoneWeb_v1
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpClient();
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.LoginPath = "/Login/Index/";
                    options.AccessDeniedPath = "/Error/Index";
                });
            services.AddSession(option =>
            {
                option.IdleTimeout = TimeSpan.FromMinutes(30);
            });
            IMvcBuilder builder = services.AddRazorPages();
            services.AddControllers(x => x.Conventions.Add(new RouteTokenTransformerConvention(new SlugifyParameterTransformer()))).AddNewtonsoftJson(options =>
              {
                  options.SerializerSettings.Converters.Add(new StringEnumConverter { CamelCaseText = true });
                  options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                  options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                  options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                  foreach (var converter in GeoJsonSerializer.Create(new GeometryFactory(new PrecisionModel(), 4326)).Converters)
                  {
                      options.SerializerSettings.Converters.Add(converter);
                  }
              }).SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            services.AddControllers(options =>
            {
                options.Conventions.Add(new RouteTokenTransformerConvention(new SlugifyParameterTransformer()));
            });
            services.AddControllersWithViews();
            services.AddTransient<IUserServices, UserService>();
            services.AddTransient<IBrandServices, BrandService>();
            services.AddTransient<ICategoryServices, CategoryService>();
            services.AddTransient<IAdminMapServices, AdminMapService>();
            var enviroment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
#if DEBUG
            if (enviroment == Environments.Development)
            {
                builder.AddRazorRuntimeCompilation();
            }
#endif
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseRouting();

            app.UseAuthorization();

            app.UseSession();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}