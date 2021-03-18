#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

#设置时区
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["Web.Background/Web.Background.csproj", "Web.Background/"]
RUN dotnet restore "Web.Background/Web.Background.csproj"
COPY . .
WORKDIR "/src/Web.Background"
RUN dotnet build "Web.Background.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Web.Background.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Web.Background.dll"]

##如果是使用发布后的文件创建镜像
##复制文件到工作目录
#COPY . /app
##启动程序
#ENTRYPOINT ["dotnet", "Web.Background.dll"]
