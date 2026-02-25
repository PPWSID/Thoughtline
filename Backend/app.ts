import "./config/global.js";
import express, { type Request, type Response } from 'express';
import userRouter from './routes/user.js';
import articleRouter from './routes/article.js';
import favoriteRouter from './routes/favorite.js';
import cookieHeader from "./middleware/cookieHeader.js";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import TerminalColors from "./constants/color.js";

const app = express();
const port = process.env.NODE_PORT || 8808;
// app.use(globalThis.cors());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(bodyParser.json());

// Middleware: Manual Cookie Parser
app.use(cookieHeader.cookieHeader);

//------------- Routes -------------//
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Free Time Project By NODE.JS');
});

app.use('/api/user', userRouter);
app.use('/api/article', articleRouter);
app.use('/api/favorite', favoriteRouter);


//------- Server Start & Port Config ------//
if (!port) {
  console.log(`${TerminalColors.red}[failed] task 1 start service port : Port is not defined.`);
  console.log(`${TerminalColors.yellow}Exit process with code 1`);
  process.exit(1);
}

const server = app.listen(port, () => {
  console.log(`${TerminalColors.green}[success] task 1 start service port : ${TerminalColors.yellow}${port}`);
});

server.on('error', (err: any) => {
  console.log(`${TerminalColors.red}[failed] task 1 start service port : ${port}`);
  console.error(err);
  console.log(`${TerminalColors.yellow}Exit process with code 1`);
  console.log(`${TerminalColors.yellow} try in cmd :  ${TerminalColors.cyan} netstat -ano | findstr :${port} \n then : taskkill /PID <PID> /F ${TerminalColors.yellow} to kill process`);
  process.exit(1);
});

server.once('listening', async () => {
  try {
    // Wait a bit for the server to be fully ready before testing
    await new Promise(resolve => setTimeout(resolve, 500));
    const response = await axios.get(`http://localhost:${port}`);
    console.log(`${TerminalColors.green}[success] Task 2 Test API Success:`, `${TerminalColors.yellow}${response.statusText}${TerminalColors.reset}`);
  } catch (error: any) {
    console.error(`${TerminalColors.red}[failed] Test API:`, `${error.message}${TerminalColors.reset}`);
  }
});

export default server;
    