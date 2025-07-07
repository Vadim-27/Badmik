using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Common
{
    public class ResultDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;

        public static T Success<T>(string message = "Success") where T : ResultDto, new()
        {
            return new T
            {
                IsSuccess = true,
                Message = message
            };
        }

        public static T Fail<T>(string message) where T : ResultDto, new()
        {
            return new T
            {
                IsSuccess = false,
                Message = message
            };
        }
    }
}
