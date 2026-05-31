# Stage 1: Build the React Application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install && chmod -R +x node_modules/.bin

# Copy the rest of the application code
COPY . .

# Define build arguments
ARG VITE_SPRING_BASE
ARG VITE_PYTHON_BASE
ARG VITE_SOCKET_BASE

# Set as environment variables for Vite to use during build
ENV VITE_SPRING_BASE=$VITE_SPRING_BASE
ENV VITE_PYTHON_BASE=$VITE_PYTHON_BASE
ENV VITE_SOCKET_BASE=$VITE_SOCKET_BASE

# Build the app (Vite outputs to /dist by default)
RUN npx vite build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Overwrite default nginx config to handle React Router properly
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
