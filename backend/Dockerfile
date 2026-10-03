# Etapa 1: compila com Maven + JDK 25
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -B -q package -DskipTests

# Etapa 2: imagem final, só com o Java e o jar
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /build/target/app.jar app.jar
RUN useradd --system app
USER app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
