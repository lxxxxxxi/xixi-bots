import { Telegraf } from 'telegraf';
import express from 'express';

// 部署到线上的话一定要注释吗？
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.XXXXXX_BOT_TOKEN;
console.log("🚀 ~ token:", token)

const app = express();
const bot = new Telegraf(token);