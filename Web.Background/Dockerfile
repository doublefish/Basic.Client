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

#���뾵��
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
#����ʱ��
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
#�趨����Ŀ¼
WORKDIR /app
#�������г���ʹ�õĶ˿ڣ�һ��Ҫ�ͳ�������ʹ�õĶ˿ڶ�Ӧ��
EXPOSE 80
EXPOSE 443
#�����ļ�������Ŀ¼
COPY . /app
#��������
ENTRYPOINT ["dotnet", "Web.Background.dll"]