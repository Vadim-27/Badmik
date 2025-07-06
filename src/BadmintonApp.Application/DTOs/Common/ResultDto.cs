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

        public static ResultDto Success(string message = "Success") =>
            new ResultDto { IsSuccess = true, Message = message };

        public static ResultDto Fail(string message) =>
            new ResultDto { IsSuccess = false, Message = message };
    }
}
