import { Router } from "express";
import { createTask, deleteTask, getTask, updateTask, updateTaskSection } from "../controllers/Task.Controller";
import { authenticateToken } from "../middleware/jwt";


const taskRouter = Router();

taskRouter.get('/task', authenticateToken, getTask);

taskRouter.post('/task', authenticateToken, createTask);

taskRouter.patch('/task', authenticateToken, updateTaskSection)

taskRouter.put('/task/:task_id', authenticateToken, updateTask);

taskRouter.delete("/task/:task_id", authenticateToken, deleteTask);


export default taskRouter;
