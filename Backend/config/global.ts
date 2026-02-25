import mongoose from "mongoose";
import dotenv from "dotenv";

import TerminalColors from "../constants/color.js";

dotenv.config();


if (!process.env.SecretKey) {
  console.error(`${TerminalColors.red}[Failed] SecretKey is not defined${TerminalColors.reset}`);
}

// MongoDB connection
const mongoUri = process.env.MG_CONNECT as string;

if (!mongoUri) {
  console.error(`${TerminalColors.red}[Failed] MG_CONNECT is not defined${TerminalColors.reset}`);
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(
      `${TerminalColors.green}[Success] Task 3 : ${TerminalColors.yellow}connected to the mongo database${TerminalColors.reset}`
    );
  })
  .catch((error: unknown) => {
    console.error(
      `${TerminalColors.red}[Failed] Task 3 : ${String(error)}${TerminalColors.reset}`
    );
    // process.exit(1); // Don't crash the server, just let it run without DB for now
  });

export {};
