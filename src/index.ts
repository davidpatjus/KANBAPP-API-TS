import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/User.Routes.js";
import taskRouter from "./routes/Task.Routes.js"
import sectionRouter from "./routes/Section.Routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use('/api', userRouter)
app.use('/api', taskRouter)
app.use('/api', sectionRouter)

app.listen(PORT, () => {
  console.clear();
  console.log("Servidor iniciado " + PORT);
});
