import Cad from "./src/job/main.js";
import YesCaptch from "./src/yesCaptcha/yesCaptcha.js";
import { readFile } from "fs/promises";
import path from "path";
import jsonData from "./src/config/yesCaptchaClientKey.json" assert { type: "json" };

const filePath = path.join(process.cwd(), "/src/config/privateKey.txt");
const clientKey = jsonData.client;

async function processFileLines(filePath, clientKey) {
  try {
    const data = await readFile(filePath, "utf8");
    const lines = data.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const privateKey = lines[i];
      await job(clientKey, privateKey);
    }
  } catch (err) {
    console.error("读取文件时发生错误:", err);
  }
}

async function job(clientKey, privateKey) {
  const yesCaptcha = new YesCaptch(
    clientKey,
    "9d92cba2-ef28-49e0-96dc-9db26a4c786e",
    "https://mint.caduceus.foundation",
    "HCaptchaTaskProxyless"
  );
  const taskId = await yesCaptcha.createTask();

  const gRecaptchaResponse = await yesCaptcha.getResponse(taskId);

  const cad = new Cad();

  const taskId_ = await cad.open(gRecaptchaResponse, privateKey);
  console.log(taskId_);
  const res = await cad.task(taskId_);
  console.log(privateKey, "->", res);
}

await processFileLines(filePath, clientKey);
