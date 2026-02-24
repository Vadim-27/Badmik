using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadmintonApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTrainingsAndPlans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TrainingParticipants");

            migrationBuilder.DropTable(
                name: "TrainingQueueEntries");

            migrationBuilder.DropTable(
                name: "Trainings");

            migrationBuilder.DropIndex(
                name: "IX_PlayerClubMemberships_ClubId",
                table: "PlayerClubMemberships");

            migrationBuilder.AddColumn<Guid>(
                name: "PlanId",
                table: "PlayerClubMemberships",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<decimal>(
                name: "PriceAtPurchase",
                table: "PlayerClubMemberships",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "PurchasedAt",
                table: "PlayerClubMemberships",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAtUtc",
                table: "PlayerClubMemberships",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedByUserId",
                table: "PlayerClubMemberships",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ClubMembershipPlans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    DurationDays = table.Column<int>(type: "integer", nullable: false),
                    TrainingsGranted = table.Column<int>(type: "integer", nullable: false),
                    SportType = table.Column<int>(type: "integer", nullable: false),
                    TrainingType = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubMembershipPlans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrainingBookings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    TrainingSessionId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    BookedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsWaitlist = table.Column<bool>(type: "boolean", nullable: false),
                    ConfirmationStatus = table.Column<int>(type: "integer", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RespondUntilUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ConfirmedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AttendanceStatus = table.Column<int>(type: "integer", nullable: false),
                    AttendanceConfirmedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AttendanceConfirmedByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CoverageStatus = table.Column<int>(type: "integer", nullable: false),
                    MembershipIdUsed = table.Column<Guid>(type: "uuid", nullable: true),
                    PaymentId = table.Column<Guid>(type: "uuid", nullable: true),
                    CoveredAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CoveredByUserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingBookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingBookings_PlayerClubMemberships_MembershipIdUsed",
                        column: x => x.MembershipIdUsed,
                        principalTable: "PlayerClubMemberships",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrainingSchedules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    Sport = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    CourtsRequired = table.Column<int>(type: "integer", nullable: false),
                    MaxParticipants = table.Column<int>(type: "integer", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingSchedules", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrainingSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    IsRecurringWeekly = table.Column<bool>(type: "boolean", nullable: false),
                    CourtsUsed = table.Column<int>(type: "integer", nullable: false),
                    MaxPlayers = table.Column<int>(type: "integer", nullable: false),
                    TrainerId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingSessions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Purpose = table.Column<int>(type: "integer", nullable: false),
                    Method = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    Currency = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    Provider = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    ProviderPaymentId = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    CheckoutUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    TrainingBookingId = table.Column<Guid>(type: "uuid", nullable: true),
                    MembershipId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PaidAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Note = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_PlayerClubMemberships_MembershipId",
                        column: x => x.MembershipId,
                        principalTable: "PlayerClubMemberships",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Payments_TrainingBookings_TrainingBookingId",
                        column: x => x.TrainingBookingId,
                        principalTable: "TrainingBookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrainingScheduleLevel",
                columns: table => new
                {
                    TrainingScheduleId = table.Column<Guid>(type: "uuid", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingScheduleLevel", x => new { x.TrainingScheduleId, x.Level });
                    table.ForeignKey(
                        name: "FK_TrainingScheduleLevel_TrainingSchedules_TrainingScheduleId",
                        column: x => x.TrainingScheduleId,
                        principalTable: "TrainingSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingSessionLevel",
                columns: table => new
                {
                    TrainingSessionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingSessionLevel", x => new { x.TrainingSessionId, x.Level });
                    table.ForeignKey(
                        name: "FK_TrainingSessionLevel_TrainingSessions_TrainingSessionId",
                        column: x => x.TrainingSessionId,
                        principalTable: "TrainingSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlayerClubMemberships_ClubId_PlayerId",
                table: "PlayerClubMemberships",
                columns: new[] { "ClubId", "PlayerId" },
                unique: true,
                filter: "\"Status\" = 1");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerClubMemberships_PlanId",
                table: "PlayerClubMemberships",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubMembershipPlans_ClubId_IsActive",
                table: "ClubMembershipPlans",
                columns: new[] { "ClubId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_ClubMembershipPlans_ClubId_Name",
                table: "ClubMembershipPlans",
                columns: new[] { "ClubId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubMembershipPlans_ClubId_UpdatedAtUtc",
                table: "ClubMembershipPlans",
                columns: new[] { "ClubId", "UpdatedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_ClubId_CreatedAtUtc",
                table: "Payments",
                columns: new[] { "ClubId", "CreatedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_MembershipId",
                table: "Payments",
                column: "MembershipId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_PlayerId_CreatedAtUtc",
                table: "Payments",
                columns: new[] { "PlayerId", "CreatedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_TrainingBookingId",
                table: "Payments",
                column: "TrainingBookingId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingBookings_MembershipIdUsed",
                table: "TrainingBookings",
                column: "MembershipIdUsed");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingBookings_PlayerId_CreatedAtUtc",
                table: "TrainingBookings",
                columns: new[] { "PlayerId", "CreatedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_TrainingBookings_TrainingSessionId_IsWaitlist",
                table: "TrainingBookings",
                columns: new[] { "TrainingSessionId", "IsWaitlist" });

            migrationBuilder.CreateIndex(
                name: "IX_TrainingBookings_TrainingSessionId_PlayerId",
                table: "TrainingBookings",
                columns: new[] { "TrainingSessionId", "PlayerId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerClubMemberships_ClubMembershipPlans_PlanId",
                table: "PlayerClubMemberships",
                column: "PlanId",
                principalTable: "ClubMembershipPlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerClubMemberships_ClubMembershipPlans_PlanId",
                table: "PlayerClubMemberships");

            migrationBuilder.DropTable(
                name: "ClubMembershipPlans");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "TrainingScheduleLevel");

            migrationBuilder.DropTable(
                name: "TrainingSessionLevel");

            migrationBuilder.DropTable(
                name: "TrainingBookings");

            migrationBuilder.DropTable(
                name: "TrainingSchedules");

            migrationBuilder.DropTable(
                name: "TrainingSessions");

            migrationBuilder.DropIndex(
                name: "IX_PlayerClubMemberships_ClubId_PlayerId",
                table: "PlayerClubMemberships");

            migrationBuilder.DropIndex(
                name: "IX_PlayerClubMemberships_PlanId",
                table: "PlayerClubMemberships");

            migrationBuilder.DropColumn(
                name: "PlanId",
                table: "PlayerClubMemberships");

            migrationBuilder.DropColumn(
                name: "PriceAtPurchase",
                table: "PlayerClubMemberships");

            migrationBuilder.DropColumn(
                name: "PurchasedAt",
                table: "PlayerClubMemberships");

            migrationBuilder.DropColumn(
                name: "UpdatedAtUtc",
                table: "PlayerClubMemberships");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "PlayerClubMemberships");

            migrationBuilder.CreateTable(
                name: "Trainings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AllowedLevels = table.Column<int[]>(type: "integer[]", nullable: true),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourtsUsed = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    IsRecurringWeekly = table.Column<bool>(type: "boolean", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: true),
                    MaxPlayers = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    TrainerId = table.Column<Guid>(type: "uuid", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trainings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrainingParticipants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RegisteredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TrainingId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingParticipants_Trainings_TrainingId",
                        column: x => x.TrainingId,
                        principalTable: "Trainings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TrainingQueueEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QueuedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TrainingId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingQueueEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingQueueEntries_Trainings_TrainingId",
                        column: x => x.TrainingId,
                        principalTable: "Trainings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlayerClubMemberships_ClubId",
                table: "PlayerClubMemberships",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingParticipants_TrainingId",
                table: "TrainingParticipants",
                column: "TrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingQueueEntries_TrainingId",
                table: "TrainingQueueEntries",
                column: "TrainingId");
        }
    }
}
