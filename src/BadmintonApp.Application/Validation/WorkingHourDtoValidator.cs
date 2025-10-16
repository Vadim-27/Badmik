using BadmintonApp.Application.DTOs.WorkingHourDtos;
using FluentValidation;
using System;
using System.Globalization;

namespace BadmintonApp.Application.Validation;

public sealed class WorkingHourDtoValidator : AbstractValidator<WorkingHourDto>
{
    public WorkingHourDtoValidator()
    {
        // Дозволяємо день бути null (клуб закритий цього дня).
        RuleFor(x => x.Monday).SetValidator(new TimeRangeDtoValidator()).When(x => x.Monday != null);
        RuleFor(x => x.Tuesday).SetValidator(new TimeRangeDtoValidator()).When(x => x.Tuesday != null);
        RuleFor(x => x.Wednesday).SetValidator(new TimeRangeDtoValidator()).When(x => x.Wednesday != null);
        RuleFor(x => x.Thursday).SetValidator(new TimeRangeDtoValidator()).When(x => x.Thursday != null);
        RuleFor(x => x.Friday).SetValidator(new TimeRangeDtoValidator()).When(x => x.Friday != null);
        RuleFor(x => x.Saturday).SetValidator(new TimeRangeDtoValidator()).When(x => x.Saturday != null);
        RuleFor(x => x.Sunday).SetValidator(new TimeRangeDtoValidator()).When(x => x.Sunday != null);

        // Щонайменше один робочий день має бути заданий
        RuleFor(x => x).Must(h =>
               h.Monday != null || h.Tuesday != null || h.Wednesday != null ||
               h.Thursday != null || h.Friday != null || h.Saturday != null ||
               h.Sunday != null)
           .WithMessage("At least one working day must be provided.")
           .WithErrorCode("WorkingHours.None");
    }
}

public sealed class TimeRangeDtoValidator : AbstractValidator<TimeRangeDto>
{
    public TimeRangeDtoValidator()
    {        
        RuleFor(x => x.From)
            .NotEmpty().WithMessage("From is required.").WithErrorCode("Time.From.Empty")
            .Must(BeValidTime).WithMessage("From must be in HH:mm format (00:00–23:59).").WithErrorCode("Time.From.Format");

        RuleFor(x => x.To)
            .NotEmpty().WithMessage("To is required.").WithErrorCode("Time.To.Empty")
            .Must(BeValidTime).WithMessage("To must be in HH:mm format (00:00–23:59).").WithErrorCode("Time.To.Format");
       
        RuleFor(x => x)
            .Custom((dto, ctx) =>
            {
                if (TryParseTime(dto.From, out var from) && TryParseTime(dto.To, out var to))
                {
                    if (to <= from)
                        ctx.AddFailure(nameof(TimeRangeDto.To), "To must be later than From.");
                }
            });
    }

    private static bool BeValidTime(string? s) => TryParseTime(s, out _);

    private static bool TryParseTime(string? s, out TimeSpan time)
    {
        time = default;
        if (string.IsNullOrWhiteSpace(s)) return false;
        
        var formats = new[] { @"hh\:mm", @"h\:mm" };
        return TimeSpan.TryParseExact(
            s.Trim(),
            formats,
            CultureInfo.InvariantCulture,
            out time);
    }
}