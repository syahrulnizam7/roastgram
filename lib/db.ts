import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// Download CA cert dari Aiven Console dan simpan di root project sebagai 'ca.pem'
const caCert = fs.readFileSync(path.join(process.cwd(), "ca.pem"));

const pool = mysql.createPool({
  host: process.env.AIVEN_MYSQL_HOST,
  port: Number(process.env.AIVEN_MYSQL_PORT),
  user: process.env.AIVEN_MYSQL_USER,
  password: process.env.AIVEN_MYSQL_PASSWORD,
  database: process.env.AIVEN_MYSQL_DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
    // Tambahkan opsi berikut untuk development
    minVersion: "TLSv1.2",
  },
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
