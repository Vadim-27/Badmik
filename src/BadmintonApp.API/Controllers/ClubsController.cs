﻿using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Validation;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClubsController : ControllerBase
    {
        private readonly IClubsService _clubsService;
        private readonly IValidator<CreateClubDto> _createClubValidation;
        private readonly IValidator<UpdateClubDto> _updateClubValidation;
        private readonly IValidator<WorkingHourDto> _workingHourDtoValidator;

        public ClubsController(IClubsService clubsService, IValidator<CreateClubDto> createClubValidation, IValidator<UpdateClubDto> updateClubValidation, IValidator<WorkingHourDto> workingHourDtoValidator
            )
        {
            _clubsService = clubsService;
            _createClubValidation = createClubValidation;
            _updateClubValidation = updateClubValidation;
            _workingHourDtoValidator = workingHourDtoValidator;
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateClubDto create, CancellationToken cancellationToken)
        {
            await _createClubValidation.ValidateAndThrowAsync(create, cancellationToken);

            await _workingHourDtoValidator.ValidateAndThrowAsync(create.WorkingHours, cancellationToken);

            var result = await _clubsService.CreateAsync(create, cancellationToken);

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult> GetAll([FromQuery] string? filter, CancellationToken cancellationToken)
        {
            var res = _clubsService.GetAllAsync(filter, cancellationToken); //?

            return Ok(res);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] UpdateClubDto dto, CancellationToken cancellationToken)
        {
            await _updateClubValidation.ValidateAndThrowAsync(dto, cancellationToken);

            await _workingHourDtoValidator.ValidateAndThrowAsync(dto.WorkingHours, cancellationToken);
            
            var result = await _clubsService.UpdateAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            await _clubsService.DeleteAsync(id, cancellationToken);

            return Ok(); // 204
        }
        
    }
}
