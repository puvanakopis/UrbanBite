package com.urbanbite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		loadEnvFile();
		SpringApplication.run(BackendApplication.class, args);
	}

	private static void loadEnvFile() {
		java.util.List<java.nio.file.Path> candidates = java.util.List.of(
				java.nio.file.Paths.get(".env"),
				java.nio.file.Paths.get("../.env"),
				java.nio.file.Paths.get("backend/.env")
		);

		for (java.nio.file.Path path : candidates) {
			if (java.nio.file.Files.exists(path)) {
				try {
					java.util.List<String> lines = java.nio.file.Files.readAllLines(path);
					for (String line : lines) {
						line = line.trim();
						if (!line.isEmpty() && !line.startsWith("#") && line.contains("=")) {
							int eqIdx = line.indexOf('=');
							String key = line.substring(0, eqIdx).trim();
							String value = line.substring(eqIdx + 1).trim();
							if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
								value = value.substring(1, value.length() - 1);
							} else if (value.startsWith("'") && value.endsWith("'") && value.length() >= 2) {
								value = value.substring(1, value.length() - 1);
							}
							if (System.getProperty(key) == null && System.getenv(key) == null) {
								System.setProperty(key, value);
							}
						}
					}

					// If DATABASE_URL is provided in postgresql://user:pass@host:port/dbname format, parse to JDBC
					String dbUrl = System.getProperty("DATABASE_URL");
					if (dbUrl != null && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
						try {
							java.net.URI uri = new java.net.URI(dbUrl);
							String userInfo = uri.getUserInfo();
							if (userInfo != null && userInfo.contains(":")) {
								String[] parts = userInfo.split(":", 2);
								String user = java.net.URLDecoder.decode(parts[0], java.nio.charset.StandardCharsets.UTF_8);
								String pass = java.net.URLDecoder.decode(parts[1], java.nio.charset.StandardCharsets.UTF_8);
								System.setProperty("SPRING_DATASOURCE_USERNAME", user);
								System.setProperty("SPRING_DATASOURCE_PASSWORD", pass);
							}
							int port = uri.getPort() != -1 ? uri.getPort() : 5432;
							String pathPart = uri.getPath();
							String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + pathPart;
							System.setProperty("SPRING_DATASOURCE_URL", jdbcUrl);
							System.setProperty("DB_DRIVER", "org.postgresql.Driver");
						} catch (Exception ex) {
							System.err.println("Could not parse DATABASE_URL URI: " + ex.getMessage());
						}
					}

					System.out.println("Loaded environment variables from: " + path.toAbsolutePath());
					ensurePostgresDatabaseExists();
					break;
				} catch (Exception e) {
					System.err.println("Could not load .env file from " + path + ": " + e.getMessage());
				}
			}
		}
	}

	private static void ensurePostgresDatabaseExists() {
		String jdbcUrl = System.getProperty("SPRING_DATASOURCE_URL");
		String username = System.getProperty("SPRING_DATASOURCE_USERNAME");
		String password = System.getProperty("SPRING_DATASOURCE_PASSWORD");

		if (jdbcUrl == null || !jdbcUrl.startsWith("jdbc:postgresql://")) {
			return;
		}

		try {
			// Extract host, port, database name
			String cleanUrl = jdbcUrl.substring("jdbc:postgresql://".length());
			int slashIdx = cleanUrl.indexOf('/');
			if (slashIdx == -1) return;

			String hostAndPort = cleanUrl.substring(0, slashIdx);
			String dbName = cleanUrl.substring(slashIdx + 1);
			int qIdx = dbName.indexOf('?');
			if (qIdx != -1) {
				dbName = dbName.substring(0, qIdx);
			}

			// Connect to default 'postgres' maintenance database to check/create the target database
			String maintenanceUrl = "jdbc:postgresql://" + hostAndPort + "/postgres";
			Class.forName("org.postgresql.Driver");

			try (java.sql.Connection conn = java.sql.DriverManager.getConnection(maintenanceUrl, username, password);
				 java.sql.Statement stmt = conn.createStatement()) {

				java.sql.ResultSet rs = stmt.executeQuery("SELECT 1 FROM pg_database WHERE datname = '" + dbName.toLowerCase() + "' OR datname = '" + dbName + "'");
				if (!rs.next()) {
					System.out.println("PostgreSQL database \"" + dbName + "\" does not exist yet. Creating database automatically...");
					stmt.executeUpdate("CREATE DATABASE \"" + dbName + "\"");
					System.out.println("Database \"" + dbName + "\" created successfully!");
				} else {
					System.out.println("PostgreSQL database \"" + dbName + "\" already exists.");
				}
			}
		} catch (Exception e) {
			System.err.println("Note on database auto-creation check: " + e.getMessage());
		}
	}

}
