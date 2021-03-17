#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

#FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
#WORKDIR /app
#EXPOSE 80
#
#FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
#WORKDIR /src
#COPY ["Web.Background/Web.Background.csproj", "Web.Background/"]
#RUN dotnet restore "Web.Background/Web.Background.csproj"
#COPY . .
#WORKDIR "/src/Web.Background"
#RUN dotnet build "Web.Background.csproj" -c Release -o /app/build
#
#FROM build AS publish
#RUN dotnet publish "Web.Background.csproj" -c Release -o /app/publish
#
#FROM base AS final
#WORKDIR /app
#COPY --from=publish /app/publish .
#ENTRYPOINT ["dotnet", "Web.Background.dll"]

#引入镜像
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
#设置时区
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
#设定工作目录
WORKDIR /app
#在容器中程序使用的端口，一定要和程序启动使用的端口对应上
EXPOSE 80
EXPOSE 443
#复制文件到工作目录
COPY . /app
#启动程序
ENTRYPOINT ["dotnet", "Web.Background.dll"]
