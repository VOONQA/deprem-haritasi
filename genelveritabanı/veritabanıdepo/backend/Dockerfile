FROM node:18

WORKDIR /app

# Önce eski paketleri kaldır
RUN apt-get update && \
    apt-get remove -y unixodbc unixodbc-dev && \
    apt-get autoremove -y && \
    apt-get clean

# SQL Server ODBC sürücülerini ve gerekli paketleri kur
RUN apt-get update && apt-get install -y \
    gnupg \
    curl \
    wget

# Microsoft SQL Server ODBC sürücülerini ekle (18 versiyonu)
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /usr/share/keyrings/microsoft-archive-keyring.gpg && \
    echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/debian/11/prod bullseye main" > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 mssql-tools18 unixodbc-dev

COPY package*.json ./

RUN npm install
RUN npm install msnodesqlv8 --save

COPY . .

EXPOSE 5000

CMD ["npm", "start"] 