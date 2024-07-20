import Cad from "./src/job/main.js";
import YesCaptch from "./src/yesCaptcha/yesCaptcha.js";
import { readFile } from "fs/promises";
import path from "path";
import jsonData from "./src/config/yesCaptchaClientKey.json" assert { type: "json" };
import jsonData1 from "./src/config/inviteAddress.json" assert { type: "json" };

const filePath = path.join(process.cwd(), "/src/config/privateKey.txt");
const clientKey = jsonData.client;
const inviter = jsonData1.address;

async function processFileLines(filePath, clientKey, inviter) {
  try {
    const data = await readFile(filePath, "utf8");
    const lines = data.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const privateKey = lines[i];
      await job(clientKey, inviter, privateKey);
    }
  } catch (err) {
    console.error("脚本运行错误:", err);
  }
}

async function job(clientKey, inviter, privateKey) {
  const yesCaptcha = new YesCaptch(
    clientKey,
    "9d92cba2-ef28-49e0-96dc-9db26a4c786e",
    "https://mint.caduceus.foundation",
    "HCaptchaTaskProxyless"
  );
  const taskId = await yesCaptcha.createTask();
  const gRecaptchaResponse = await yesCaptcha.getResponse(taskId);

  const cad = new Cad();

  const res = await cad.invite(gRecaptchaResponse, inviter, privateKey);
  console.log(res);
}

//启动
await processFileLines(filePath, clientKey, inviter);
