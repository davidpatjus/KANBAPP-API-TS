import { Router } from "express";
import { getSections, getSectionsTasks, createSection, deleteSection, updateSection } from "../controllers/Section.Controller";
import { authenticateToken } from "../middleware/jwt";

const sectionRouter = Router();

sectionRouter.get("/sections/", authenticateToken, getSections); 

sectionRouter.get("/sections/tasks/", authenticateToken, getSectionsTasks);

sectionRouter.post("/section", authenticateToken, createSection);

sectionRouter.delete("/section/:id_section", authenticateToken, deleteSection);

sectionRouter.put("/section/:id_section", authenticateToken, updateSection);

export default sectionRouter;