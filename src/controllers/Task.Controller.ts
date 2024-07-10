import { Request, Response } from 'express';
import  pool  from "../db"; // Importa la conexión a la base de datos
import { marked } from 'marked'; // Importa la biblioteca para convertir Markdown a HTML

export const getTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM tasks'); // Consulta todas las tareas
        res.status(200).json(result.rows); // Envía las tareas como respuesta JSON
    } catch (err) {
        console.error(err); // Registra el error en la consola
        res.status(500).send('Error retrieving tasks'); // Envía un mensaje de error
    }
}

export const createTask = async (req: Request, res: Response): Promise<void> => {
    const { title, body } = req.body; // Extrae datos del cuerpo de la solicitud
    
    const htmlBody = marked(body); // Convierte el cuerpo Markdown a HTML
  
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, body) VALUES ($1, $2) RETURNING *',
            [title, htmlBody]
        ); // Inserta la nueva tarea en la base de datos
        res.status(201).json(result.rows[0]); // Envía la tarea creada como respuesta JSON
    } catch (err) {
        console.error(err); // Registra el error en la consola
        res.status(500).send('Error creating task'); // Envía un mensaje de error
    }
}

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const { task_id } = req.params; // Obtiene el ID de la tarea de los parámetros de la URL
    const { title, body, id_section } = req.body; // Extrae datos del cuerpo de la solicitud
    
    const htmlBody = marked(body); // Convierte el cuerpo Markdown a HTML
    
    try {
        const result = await pool.query(
            'UPDATE tasks SET title=$1, body=$2, id_section=$3 WHERE id_task=$4 RETURNING *',
            [title, htmlBody, id_section, task_id]
        ); // Actualiza la tarea en la base de datos
        res.status(200).json(result.rows[0]); // Envía la tarea actualizada como respuesta JSON
    } catch (err) {
        console.error(err); // Registra el error en la consola
        res.status(500).send('Error updating task'); // Envía un mensaje de error
    }
}

export const updateTaskSection = async (req: Request, res:Response ) => {
    
    const { id_section, task_id } = req.body; // Extrae datos del cuerpo de la solicitud
    try {
        const result = await pool.query(
            'UPDATE tasks SET id_section=$1 WHERE id_task=$2 RETURNING *',
            [id_section, task_id]
        ); // Actualiza la tarea en la base de datos
            res.status(200).json("tarea actualizada"); // Envía la tarea actualizada como respuesta JSON
        } catch (err) {
            console.error(err); // Registra el error en la consola
            res.status(500).send('Error updating task'); // Envía un mensaje de error
        }
}

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    const { task_id } = req.params; // Obtiene el ID de la tarea de los parámetros de la URL
    
    try {
        const result = await pool.query(
          "DELETE FROM tasks WHERE id_task = $1 RETURNING *",
          [task_id]
        ); // Elimina la tarea de la base de datos
        res.status(200).json(result.rows[0]); // Envía la tarea eliminada como respuesta JSON
    } catch (err) {
        console.error(err); // Registra el error en la consola
        res.status(500).send('Error deleting task'); // Envía un mensaje de error
    }
}
