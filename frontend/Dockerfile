# Use the official Node.js 20 image.
FROM node:20-slim

# Set the working directory in the container.
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to the working directory.
COPY package.json pnpm-lock.yaml ./

# Install dependencies.
RUN pnpm install

# Copy the rest of the application code.
COPY . .

# Build the Next.js application.
RUN pnpm run build

# Expose the port the app runs on.
EXPOSE 3000

# Define the command to run the app.
CMD ["pnpm", "start"]
