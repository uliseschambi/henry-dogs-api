# Use the official Node.js image as the base image
FROM node:16.19.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the application files into the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs in
EXPOSE 3001

# Define the entry point for the container
CMD [ "node", "index.js" ]