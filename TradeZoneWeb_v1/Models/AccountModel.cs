using System.ComponentModel.DataAnnotations;

namespace TradeZoneWeb_v1.Models
{
    public class AccountModel
    {
        public string Id { get; set; }
        public string Role { get; set; }
        public string Name { get; set; }
        public string FireBaseUid { get; set; }
        public string FcmToken { get; set; }
        public string Email { get; set; }

        [Required(ErrorMessage = "Please enter your branch name")]
        public string BrandName { get; set; }

        public string PhoneNumber { get; set; }
    }
}