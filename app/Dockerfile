# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port that our server listens on
EXPOSE 3000

# Start the Node.js server
CMD [ "node", "server.js" ]
