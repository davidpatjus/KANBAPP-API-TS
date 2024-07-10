import { jwtVerify } from "jose";
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

// Interfaz para el cuerpo de la solicitud
interface UserRequestBody extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  },
  user?: Object;
}

dotenv.config();

  // Middleware de autenticación
const authenticateToken = async (req: UserRequestBody, res: Response, next: NextFunction): Promise<void> => {
    //obten el token desde la cookie
    const token = req.cookies.token;
    // Verifica si el token existe
    if (!token) {
        res.status(401).json({ message: "No autorizado" });
        return;
        }

    try {
        const encoder = new TextEncoder(); // Crea un nuevo TextEncoder
        const { payload } = await jwtVerify(token, encoder.encode(process.env.secret)); // Verifica el token y extrae el payload
        req.user = payload; // Asigna el payload del token al objeto req.user
        next(); // Llama al siguiente middleware
    } catch (err) {
        console.error(err); // Imprime el error en la consola
        res.status(401).send('Token inválido o expirado'); // Responde con un error 401 si el token es inválido o ha expirado
        return;
    }
};
  
export { authenticateToken };