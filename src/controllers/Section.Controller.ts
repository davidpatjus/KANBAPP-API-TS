import { Request, Response } from 'express';
import pool from '../db';

interface Section {
  id_section: number;
  id_users: number;
  title: string;
}

interface Task {
  id_task: number;
  id_section: number;
  title: string;
  description: string;
}

export const getSections = async (req: Request, res: Response): Promise<void> => {
  const id_usuario: string = req.params.id_users;

  try {
    const result = await pool.query('SELECT * FROM sections WHERE id_users = $1', [id_usuario]);
    res.send(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error retrieving sections');
  }
};

export const getSectionsTasks = async (req: Request, res: Response): Promise<void> => {
  const id_usuario: string = req.params.id_users;

  try {
    const sectionsResult = await pool.query('SELECT * FROM sections WHERE id_users = $1', [id_usuario]);
    const sections: Section[] = sectionsResult.rows;

    const sectionsTasks: { section: Section, tasks: Task[] }[] = [];

    for (const section of sections) {
      const tasksResult = await pool.query('SELECT * FROM tasks WHERE id_section = $1', [section.id_section]);
      const tasks: Task[] = tasksResult.rows;
      sectionsTasks.push({ section, tasks });
    }

    res.send(sectionsTasks);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error retrieving sections');
  }
};

export const createSection = async (req: Request, res: Response): Promise<void> => {
  const { id_users, title }: { id_users: number, title: string } = req.body;

  try {
    const result = await pool.query('INSERT INTO sections (id_users, title) VALUES ($1, $2) RETURNING *', [id_users, title]);
    res.status(201).send("Sección creada correctamente");
  } catch (e) {
    console.error(e);
    res.status(500).send('Error creating section');
  }
};

export const deleteSection = async (req: Request, res: Response): Promise<void> => {
  const { id_section }: { id_section: string } = req.body;

  try {
    const result = await pool.query('DELETE FROM sections WHERE id_section = $1 RETURNING *', [id_section]);
    
    if (result && result.rowCount && result.rowCount > 0) {
      res.send(result.rows);
    } else {
      res.status(404).send("Sección no encontrada");
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Error deleting section');
  }
};


export const updateSection = async (req: Request, res: Response): Promise<void> => {
  const { id_section }: { id_section: string } = req.body;
  const { title }: { title: string } = req.body;

  try {
    const result = await pool.query(
      'UPDATE sections SET title = $1 WHERE id_section = $2 RETURNING *',
      [title, id_section]
    );

    if (result.rowCount === 0) {
      res.status(404).send('Sección no encontrada');
    }
    res.send(`Se actualizó la sección: ${JSON.stringify(result.rows[0])}`);
  } catch (e) {
    console.error(`No se pudo actualizar la sección ${id_section}:`, e);
    res.status(500).send('Error updating section');
  }
};