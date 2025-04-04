import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.AIVEN_MYSQL_HOST,
  port: Number(process.env.AIVEN_MYSQL_PORT),
  user: process.env.AIVEN_MYSQL_USER,
  password: process.env.AIVEN_MYSQL_PASSWORD,
  database: process.env.AIVEN_MYSQL_DB_NAME,
  ssl: process.env.AIVEN_CA_CERT
    ? {
        rejectUnauthorized: true,
        ca: Buffer.from(process.env.AIVEN_CA_CERT, "base64"),
        minVersion: "TLSv1.2",
      }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
