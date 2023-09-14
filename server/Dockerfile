# Use multi-stage build to separate build and production stages

# Build stage
FROM node:16 AS build
WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json first to leverage Docker cache
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --verbose

# Production stage
FROM node:16
WORKDIR /usr/src/app

#Environment
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

#app
ARG PORT
ENV PORT ${PORT}

ARG ENDPOINT_API
ENV ENDPOINT_API ${ENDPOINT_API}

#DB config
ARG DB_PORT
ENV DB_PORT ${DB_PORT}

ARG DB_INSTANCE
ENV DB_INSTANCE ${DB_INSTANCE}


# Copy node_modules from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Run as non-root user for security
USER node

# Expose the port the app runs on
EXPOSE 8080

# Add a health check command
HEALTHCHECK --interval=12s --timeout=12s --start-period=30s CMD node ./src/utils/healthCheck.util.js

CMD ["./bin/www"]