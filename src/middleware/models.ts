import { Request, Response, NextFunction } from 'express';

// Interfaz para el cuerpo de la solicitud
interface UserRequestBody extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  }
}

const validateLogin = (req: UserRequestBody, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  // Verificar que email sea un email válido y tenga como máximo 100 caracteres
  if (!validateEmail(email) || email.length > 100) {
    res.status(400).send("El email debe ser válido y tener máximo 100 caracteres");
    return;
  }

  // Verificar que password sea una cadena y tenga como máximo 100 caracteres
  if (typeof password !== "string" || password.length > 100 || password.length < 4) {
    res.status(400).send("La contraseña debe ser una cadena entre 4 y 100 caracteres");
    return;
  }

  next();
}

// Middleware para validar el formato de email
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Middleware de validación personalizado
const validateUser = (req: UserRequestBody, res: Response, next: NextFunction): void => {
  const { name, email, password } = req.body;

  if (typeof name !== 'string' || name.length > 50 || name.length < 4) {
    res.status(400).send("El nombre debe ser una cadena de texto de mínimo 4 caracteres y máximo 50");
    return;
  }

  if (!validateEmail(email) || email.length > 100) {
    res.status(400).send("El email debe ser válido y tener máximo 100 caracteres");
    return;
  }

  if (typeof password !== 'string' || password.length > 100 || password.length < 4) {
    res.status(400).send("La contraseña debe ser una cadena entre 4 y 100 caracteres");
    return;
  }

  next();
};

export { validateUser, validateLogin };