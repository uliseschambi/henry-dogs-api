# Use the official Node.js image as the base image
FROM node:16.19.1

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY . /app

# Install the application dependencies
RUN npm install

# Define the entry point for the container
EXPOSE 3001
EXPOSE 8080
CMD ["npm", "start"]