import Cad from "./src/job/main.js";
import Mu from "./src/mu/local.js";
import { readFile } from "fs/promises";
import path from "path";
import jsonData from "./src/config/damaKey.json" assert { type: "json" };

const filePath = path.join(process.cwd(), "/src/config/privateKey.txt");
const clientKey = jsonData.key;

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
  const mu = new Mu(clientKey, "1001", "d355d3bf29d3c17c463aafb0e0a5748b");

  let boo = false;
  var response = "";
  while (!boo) {
    const res = await mu.createTask();

    response = await mu.getResponse(res);
    console.log(response);
    if (response) {
      boo = true;
    }
  }

  const cad = new Cad();

  const taskId_ = await cad.open_jy(
    response.captcha_id,
    response.captcha_output,
    response.gen_time,
    response.lot_number,
    response.pass_token,
    privateKey
  );
  console.log(taskId_);
  await cad.task(taskId_);
}

await processFileLines(filePath, clientKey);
