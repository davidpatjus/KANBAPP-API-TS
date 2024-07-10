import pg, { Pool, PoolConfig } from 'pg';
import dotenv from "dotenv";

dotenv.config();

// Configuración del pool de conexiones a PostgreSQL
const poolConfig: PoolConfig = {
    user: process.env.user!,
    host: process.env.host!,
    password: process.env.password!,
    database: process.env.database!,
    port: Number(process.env.db_port),  // Asegúrate de convertir el puerto a número
};

const pool: Pool = new pg.Pool(poolConfig);

// Test de conexión a la base de datos
pool.connect((err: Error | undefined) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database:', err.stack);
    } else {
        console.log("Connected to PostgreSQL database");
    }
});

export default pool;