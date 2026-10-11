# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a non-root user
RUN addgroup -S urbanbite && adduser -S urbanbite -G urbanbite
USER urbanbite

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Environment variables with sensible defaults
ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8080

ENTRYPOINT ["java", "-jar", "app.jar"]
