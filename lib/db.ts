import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

const getCertPath = () => {
  // Untuk development/local
  if (process.env.NODE_ENV !== "production") {
    return path.join(process.cwd(), "public", "ca.pem");
  }

  // Untuk production di Vercel
  return path.join("/var/task/public", "ca.pem");
};

const poolConfig = {
  host: process.env.AIVEN_MYSQL_HOST,
  port: Number(process.env.AIVEN_MYSQL_PORT),
  user: process.env.AIVEN_MYSQL_USER,
  password: process.env.AIVEN_MYSQL_PASSWORD,
  database: process.env.AIVEN_MYSQL_DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(getCertPath()),
  },
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(poolConfig);

export default pool;
