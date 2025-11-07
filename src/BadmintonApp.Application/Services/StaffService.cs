using AutoMapper;
using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Staffs;
using BadmintonApp.Application.Interfaces.Transactions;
using BadmintonApp.Domain.Core;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services;

public class StaffService : IStaffService
{
    private readonly IStaffRepository _staffRepository;
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepository;
    private readonly ITransactionService _transactionService;
    private readonly IPasswordHasher<User> _passwordHasher;

    public StaffService(IStaffRepository staffRepository, IPasswordHasher<User> passwordHasher, IMapper mapper, IUserRepository userRepository, ITransactionService transactionService)
    {
        _staffRepository = staffRepository;
        _mapper = mapper;
        _userRepository = userRepository;
        _transactionService = transactionService;
        _passwordHasher = passwordHasher;
    }

    public async Task<PaginationListDto<StaffDto>> GetAll(ClubPaginationFilterDto paginationFilterDto, CancellationToken cancellationToken)
    {
        var staffs = await _staffRepository.GetAll(paginationFilterDto, cancellationToken);

        var mapped = _mapper.Map<List<StaffDto>>(staffs.List);

        return new PaginationListDto<StaffDto>
        {
            List = mapped,
            TotalCount = staffs.TotalCount,
            Page = staffs.Page,
            PageSize = staffs.PageSize
        };
    }

    public async Task<StaffDto> GetById(Guid id, CancellationToken cancellationToken)
    {
        var staff = await _staffRepository.GetById(id, cancellationToken);

        return _mapper.Map<StaffDto>(staff);
    }

    public async Task Update(StaffUpdateDto dto, CancellationToken cancellationToken)
    {

        var staff = _mapper.Map<Staff>(dto);

        var staffRepo = await _staffRepository.GetById(dto.Id, cancellationToken);

        var user = await _userRepository.GetByIdAsync(staffRepo.UserId, cancellationToken);

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Email = dto.Email;

        await _transactionService.Begin(cancellationToken);
        try
        {
            await _userRepository.UpdateAsync(user, cancellationToken);
            await _staffRepository.Update(staff, cancellationToken);
            await _transactionService.Commit(cancellationToken);
        }
        catch (Exception)
        {
            await _transactionService.RollBack(cancellationToken);

            throw;
        }
    }


    public async Task ChangePassword(StaffUpdatePasswordDto staffUpdateDto, CancellationToken cancellationToken)
    {
        var staff = await _staffRepository.GetById(staffUpdateDto.StaffId, cancellationToken);
        if (staff == null)
        {
            throw new KeyNotFoundException("Staff not found");
        }
        var user = await _userRepository.GetByIdAsync(staff.UserId, cancellationToken);

        var passwordHash = _passwordHasher.HashPassword(user, staffUpdateDto.Password);
        await _userRepository.UpdatePasswordAsync(user.Id, passwordHash, cancellationToken);

    }
}
