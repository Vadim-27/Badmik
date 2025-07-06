using BadmintonApp.Application.DTOs.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Auth
{
    public class LoginResultDto: ResultDto
    {
        public string Token { get; set; }              
        public string RefreshToken { get; set; }       

        public DateTime? ExpiresAt { get; set; }        

        public string UserId { get; set; }             
        public string Role { get; set; }               
        public string Email { get; set; }              
        public string FullName { get; set; }
    }
}
