FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ../../ ./
RUN dotnet restore src/BadmintonApp.API/BadmintonApp.API.csproj --no-cache
RUN dotnet publish src/BadmintonApp.API/BadmintonApp.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# add EF CLI tools to the final image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BadmintonApp.API.dll"]