import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

import TerminalColors from "../constants/color.js";

dotenv.config();

// Global declarations
declare global {
  var express: any;
  var cors: typeof import("cors");
  var mongoose: typeof import("mongoose");
  var bodyParser: any;
  var axios: any;
  var bcrypt: any;
  var fs: typeof import("node:fs");
  var path: typeof import("node:path");
  var GLOBAL_VALUE: NodeJS.ProcessEnv;
  var Schema: typeof mongoose.Schema;
  var SECRET_KEY: string;
  var jwt: typeof import("jsonwebtoken");
  var Colors: typeof TerminalColors;
}

globalThis.express = express;
globalThis.cors = cors;
globalThis.mongoose = mongoose;
globalThis.bodyParser = bodyParser;
globalThis.axios = axios;
globalThis.bcrypt = bcrypt;
globalThis.fs = fs;
globalThis.path = path;
globalThis.GLOBAL_VALUE = process.env;
globalThis.Schema = mongoose.Schema;
globalThis.jwt = jwt;
globalThis.Colors = TerminalColors;
globalThis.SECRET_KEY = process.env.SecretKey as string;

if (!globalThis.SECRET_KEY) {
  console.error(`${Colors.red}[Failed] SecretKey is not defined${Colors.reset}`);
  process.exit(1);
}

// MongoDB connection
const mongoUri = process.env.MG_CONNECT as string;

if (!mongoUri) {
  console.error(`${Colors.red}[Failed] MG_CONNECT is not defined${Colors.reset}`);
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(
      `${Colors.green}[Success] Task 3 : ${Colors.yellow}connected to the mongo database${Colors.reset}`
    );
  })
  .catch((error: unknown) => {
    console.error(
      `${Colors.red}[Failed] Task 3 : ${String(error)}${Colors.reset}`
    );
    process.exit(1);
  });

export {};
