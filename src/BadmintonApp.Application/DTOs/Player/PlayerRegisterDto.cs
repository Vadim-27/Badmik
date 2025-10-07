﻿using BadmintonApp.Domain.Trainings.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Player
{
    public class PlayerRegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Guid ClubId { get; set; }
        public PlayerLevel Level { get; set; }

        public DateTime DoB { get; set; }
    }
}
