FROM ubuntu:20.04

# Copy project
COPY ./ ./dynoBot
WORKDIR ./dynoBot

# Install dependencies
RUN apt-get update
RUN apt-get install build-essential curl -y
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install nodejs -y
RUN apt-get install lua5.3 -y
RUN npm install

# Start project
RUN npm start
