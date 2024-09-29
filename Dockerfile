# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /d/development/node/nbrtax

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (if applicable)
EXPOSE 3000

# Set the environment variables (optional, adjust if needed)
#ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
#CMD ["npm", "run", "dev"]
