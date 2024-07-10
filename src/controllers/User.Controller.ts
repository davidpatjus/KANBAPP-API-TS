import pool from '../db'; // Importa la conexión a la base de datos desde el archivo db.js
import bcrypt from 'bcrypt'; // Importa bcrypt para el hashing de contraseñas
import { SignJWT } from 'jose'; // Importa funciones para manejar JSON Web Tokens (JWT)
import { Pool } from 'pg';
import dotenv from "dotenv"; // Importa dotenv para cargar variables de entorno desde un archivo .env
import { Request, Response } from 'express';

dotenv.config();

const secret = process.env.SECRET as string; // Asegúrate de que SECRET esté definido en el archivo .env

/* // Configura la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
 */
// Interfaz para el cuerpo de la solicitud
interface UserRequestBody extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  },
  user?: { id_users: string }; // Aseguramos que `req.user` puede existir y tener `id_users`
}

// Exporta la función getUsers que obtiene todos los usuarios de la base de datos
export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result = await pool.query('SELECT * FROM users');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error retrieving users');
  }
}

// Exporta la función getUserById que obtiene un usuario de la base de datos
export const getUserById = async (req: UserRequestBody, res: Response): Promise<Response> => {
  const id = req.user?.id_users;

  if (!id) return res.status(400).send('Id is necessary');

  try {
    const result = await pool.query('SELECT * FROM users WHERE id_users = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error retrieving user');
  }
};

// Exporta la función createUser que crea un nuevo usuario en la base de datos
export const createUser = async (req: UserRequestBody, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    res.status(201).json(result.rows[0])
    return;
  } catch (err) {
    res.status(500).send('Error creating user')
    return;
  }
};

// Exporta la función login que autentica a un usuario y genera un token JWT
export const login = async (req: UserRequestBody, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send('Email y contraseña son requeridos');

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) return res.status(401).send('Email inválido');
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send('Contraseña inválida');

    const encoder = new TextEncoder();
    const id_users = `${user.id_users}`;
    const jwtConstructor = new SignJWT({ id_users });
    const jwt = await jwtConstructor
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(encoder.encode(secret));

    res.cookie('token', jwt, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000
    });

    return res.send({ jwt });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error al iniciar sesión');
  }
};

// Exporta la función deleteUser que elimina un usuario de la base de datos
export const deleteUser = async (req: UserRequestBody, res: Response): Promise<Response> => {
  const id = req.user?.id_users;

  try {
    const result = await pool.query('DELETE FROM users WHERE id_users = $1 RETURNING *', [id]);
    const user = result.rows[0];

    if (!user) return res.status(404).send('Usuario no encontrado');

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error al eliminar el usuario');
  }
}

// Exporta la función updateUser que actualiza la información de un usuario en la base de datos
export const updateUser = async (req: UserRequestBody, res: Response): Promise<Response> => {
  const id = req.user?.id_users;
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(401).send('Faltan datos');

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3 WHERE id_users = $4 RETURNING *',
      [name, email, hashedPassword, id]
    );
    const user = result.rows[0];

    if (!user) return res.status(404).send('Usuario no encontrado');

    delete user.password;

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error al actualizar el usuario');
  }
}