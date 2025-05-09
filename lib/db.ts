import mysql from "mysql2/promise";
import { Buffer } from "buffer";

const pool = mysql.createPool({
  host: process.env.AIVEN_MYSQL_HOST,
  port: Number(process.env.AIVEN_MYSQL_PORT) || 25060,
  user: process.env.AIVEN_MYSQL_USER,
  password: process.env.AIVEN_MYSQL_PASSWORD,
  database: process.env.AIVEN_MYSQL_DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Ubah menjadi false untuk local dan production
    ca: Buffer.from(process.env.AIVEN_CA_CERT || "", "base64").toString(),
    minVersion: "TLSv1.2",
  },
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
