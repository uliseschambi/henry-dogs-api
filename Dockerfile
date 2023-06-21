# Use the official Node.js image as the base image
FROM node:16.19.1

# Set the working directory in the container
WORKDIR /

# Copy the application files into the working directory
COPY . /

# Install the application dependencies
RUN npm install

# Expose the port the app runs in
EXPOSE 3001/tcp

# Define the entry point for the container
CMD ["npm", "start"]