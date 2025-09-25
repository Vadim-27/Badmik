#FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS base
#WORKDIR /app
#EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY . .
#WORKDIR /src/BadmintonApp.API

RUN dotnet restore BadmintonApp.API 
RUN dotnet publish BadmintonApp.API -c Release -o out

FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "BadmintonApp.API.dll"]