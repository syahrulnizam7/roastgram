import mysql from "mysql2/promise";

const createPool = () => {
  if (
    !process.env.AIVEN_MYSQL_HOST ||
    !process.env.AIVEN_MYSQL_USER ||
    !process.env.AIVEN_MYSQL_PASSWORD ||
    !process.env.AIVEN_MYSQL_DB_NAME
  ) {
    throw new Error("Database configuration is missing");
  }

  return mysql.createPool({
    host: process.env.AIVEN_MYSQL_HOST,
    port: Number(process.env.AIVEN_MYSQL_PORT) || 25060,
    user: process.env.AIVEN_MYSQL_USER,
    password: process.env.AIVEN_MYSQL_PASSWORD,
    database: process.env.AIVEN_MYSQL_DB_NAME,
    ssl: process.env.AIVEN_CA_CERT
      ? {
          rejectUnauthorized: true,
          ca: Buffer.from(process.env.AIVEN_CA_CERT, "base64").toString(),
          minVersion: "TLSv1.2",
        }
      : undefined,
    waitForConnections: true,
    connectionLimit: 10,
  });
};

const pool = createPool();
export default pool;
