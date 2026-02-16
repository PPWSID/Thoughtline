import "./config/global.js";
import express, { type Request, type Response } from 'express';
import userRouter from './routes/user.js';
import articleRouter from './routes/article.js';


const app = express();
const port = GLOBAL_VALUE.NODE_PORT || 5000;

app.use(global.cors());
app.use(global.bodyParser.json());

// Middleware: Manual Cookie Parser
app.use((req: any, res: any, next: any) => {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        const cookies: Record<string, string> = {};
        cookieHeader.split(';').forEach((cookie: string) => {
            const parts = cookie.split('=');
            const name = parts[0]?.trim();
            if (name) {
                cookies[name] = parts.slice(1).join('=');
            }
        });
        req.cookies = cookies;
    } else {
        req.cookies = {};
    }
    next();
});

//------------- Routes -------------//
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Free Time Project By NODE.JS');
});

app.use('/api/user', userRouter);
app.use('/api/article', articleRouter);


//------- Server Start & Port Config ------//
if (!port) {
  console.log(`${Colors.red}[failed] task 1 start service port : Port is not defined.`);
  console.log(`${Colors.yellow}Exit process with code 1`);
  process.exit(1);
}

const server = app.listen(port, () => {
  console.log(`${Colors.green}[success] task 1 start service port : ${Colors.yellow}${port}`);
});

server.on('error', (err: any) => {
  console.log(`${Colors.red}[failed] task 1 start service port : ${port}`);
  console.error(err);
  console.log(`${Colors.yellow}Exit process with code 1`);
  console.log(`${Colors.yellow} try in cmd :  ${Colors.cyan} netstat -ano | findstr :${port} \n then : taskkill /PID <PID> /F ${Colors.yellow} to kill process`);
  process.exit(1);
});

server.once('listening', async () => {
  try {
    // Wait a bit for the server to be fully ready before testing
    await new Promise(resolve => setTimeout(resolve, 500));
    const response = await axios.get(`http://localhost:${port}`);
    console.log(`${Colors.green}[success] Task 2 Test API Success:`, `${Colors.yellow}${response.statusText}${Colors.reset}`);
  } catch (error: any) {
    console.error(`${Colors.red}[failed] Test API:`, `${error.message}${Colors.reset}`);
  }
});

export default server;
    