using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums.Player;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Domain.Players;

public class Player
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; }
    public Guid ClubId { get; set; }
    public Club Club { get; set; }
    public ICollection<PlayerFavoriteLocation> FavoriteLocations { get; set; } = new List<PlayerFavoriteLocation>();
    public ICollection<PlayerSportProfile> SportProfiles { get; set; } = new List<PlayerSportProfile>();
    public ICollection<PlayerSubscription> Following { get; set; } = new List<PlayerSubscription>();
    public ICollection<PlayerSubscription> Followers { get; set; } = new List<PlayerSubscription>();
    public ICollection<PlayerClubMembership> ClubMemberships { get; set; } = new List<PlayerClubMembership>();
}