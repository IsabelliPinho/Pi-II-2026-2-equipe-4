# Etapa 1: Compilação com Java 21 e Maven
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Execução leve apenas com o Java
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta que o seu servidor Java usa (geralmente 8080)
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]