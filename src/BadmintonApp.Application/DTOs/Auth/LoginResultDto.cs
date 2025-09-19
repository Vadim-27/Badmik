﻿using System;
using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Auth;

public class LoginResultDto
{
    public string Token { get; set; }
    public string RefreshToken { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public string UserId { get; set; }
    public string Role { get; set; }
    public IEnumerable<string> Permissions { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }
}
