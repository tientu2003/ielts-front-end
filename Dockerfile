# Use a Node.js LTS base image
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Define build arguments
ARG KEYCLOAK_ID
ARG KEYCLOAK_SECRET
ARG KEYCLOAK_ISSUER
ARG NEXT_PUBLIC_KEYCLOAK_ID
ARG NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL
ARG NEXT_PUBLIC_READING_SERVICE_URL
ARG NEXT_PUBLIC_LISTENING_SERVICE_URL
ARG NEXTAUTH_SECRET

# Optionally, persist build arguments as environment variables
ENV KEYCLOAK_ID=$KEYCLOAK_ID
ENV KEYCLOAK_SECRET=$KEYCLOAK_SECRET
ENV KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER
ENV NEXT_PUBLIC_KEYCLOAK_ID=$NEXT_PUBLIC_KEYCLOAK_ID
ENV NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL=$NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL
ENV NEXT_PUBLIC_READING_SERVICE_URL=$NEXT_PUBLIC_READING_SERVICE_URL
ENV NEXT_PUBLIC_LISTENING_SERVICE_URL=$NEXT_PUBLIC_LISTENING_SERVICE_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Prepare the production image
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json /app/
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public

# Install only production dependencies
RUN npm install --only=production

# Expose the default port Next.js runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
