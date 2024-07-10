import { Router } from "express";
import { getUsers, createUser, login, deleteUser, updateUser, getUserById } from "../controllers/User.Controller";
import { validateUser, validateLogin } from "../middleware/models";
import { authenticateToken } from "../middleware/jwt";

const userRouter = Router();

//login
userRouter.post("/login", validateLogin, login);

//register
userRouter.post('/user', validateUser, createUser);

//getUser
userRouter.get('/users', getUsers);

//getUserById
userRouter.get('/user', authenticateToken, getUserById)

// Eliminar usuario por ID
userRouter.delete('/user', authenticateToken, deleteUser);

// Actualizar usuario por ID
userRouter.put('/user', authenticateToken, validateUser, updateUser);

export default userRouter;