#Etapa 1: La contruccion
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

#Copiar el archivo de proyecto y restaurar dependencias
COPY ["auth-service-csproj", "./"]
RUN dotnet restore "auth-service.csproj"

#copiar el resto del codigo y compilar
COPY . .
RUN dotnet publish "auth-service.csproj" -c Release -o /app/publish

#Etapa 2: Mandamos todo a ejecutar
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

#Exponemos el puerto
EXPOSE 80
ENTRYPOINT [ "dotnet", "auth-service.dll" ]