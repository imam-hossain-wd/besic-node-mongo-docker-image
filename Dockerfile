# Use the official Node.js 20 Alpine image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Copy the .env file to the container
COPY .env .env

# Expose the port your app will run on
EXPOSE 5000

# Start your Node.js app
CMD ["npm", "start"]
