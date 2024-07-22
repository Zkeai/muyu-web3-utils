import Cad from "./src/job/main.js";
import Ttorc from "./src/ttorc/ttorc.js";
import { readFile } from "fs/promises";
import path from "path";
import jsonData from "./src/config/damaKey.json" assert { type: "json" };
import jsonData1 from "./src/config/inviteAddress.json" assert { type: "json" };

const filePath = path.join(process.cwd(), "/src/config/privateKey.txt");
const clientKey = jsonData.key;
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
  const ttorc = new Ttorc(
    clientKey,
    "e5cf8ccc7e40a0cf260aea741978f5e9",
    "42",
    "d355d3bf29d3c17c463aafb0e0a5748b"
  );
  let boo = false;
  var response = "";
  while (!boo) {
    const res = await ttorc.createTask();
    response = await ttorc.getResponse(res);
    if (response) {
      boo = true;
    }
  }

  const cad = new Cad();

  const invite_res = await cad.invite_jy(
    response.captchaId,
    response.captchaOutput,
    response.genTime,
    response.lotNumber,
    response.passToken,
    inviter,
    privateKey
  );
  console.log(invite_res);
}

//启动
await processFileLines(filePath, clientKey, inviter);
