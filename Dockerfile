# Use a base image of Node.js
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript code
RUN npx tsc

# Expose the port on which the application will run
EXPOSE 310

# Define the environment variable for production
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "dist/index.js"]
