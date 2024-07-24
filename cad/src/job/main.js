import { ethers } from "ethers";
import Web3 from "web3";

class Cad {
  constructor() {
    this.baseUrl = "https://mint.caduceus.foundation/api/v2";
    this.web3 = new Web3("https://pegasus.rpc.caduceus.foundation");
  }

  async signInviteMessage(inviteAddress, address) {
    try {
      let msg = b(inviteAddress + address);
      let RZ =
        "0x73eafab85f7c58cebf8fda3a77933f086cba5ac42f63182934622e85cba078d5";

      let sigObj = await this.web3.eth.accounts.sign(msg, RZ);
      let signature = sigObj.signature;
      return signature;
    } catch (error) {
      throw new Error("Error signing message: " + error.message);
    }
  }

  async signMessage_open(privateKey, timestamp) {
    try {
      let wallet = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      let address = wallet.address.toLowerCase();
      let re = `userAddress=${address}&timestamp=${timestamp}`;
      let J = await this.web3.eth.accounts.sign(re, privateKey);
      return J.signature;
    } catch (error) {
      throw new Error("Error signing message: " + error.message);
    }
  }

  async open(token, privateKey) {
    try {
      const timestamp = Math.floor(Date.now() / 1e3);
      const signature = await this.signMessage_open(privateKey, timestamp);
      let wallet = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      let address = wallet.address.toLowerCase();

      const data = {
        userAddress: address,
        timestamp: timestamp,
        signature: signature,
      };

      const response = await fetch(
        "https://mint.caduceus.foundation/api/v2/lottery",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh,zh-CN;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            pragma: "no-cache",
            priority: "u=1, i",
            "r-token": token,
            cookie: "selectWallet=OKX",
            Referer: "https://mint.caduceus.foundation/",
            "Referrer-Policy": "origin",
          },
          body: JSON.stringify(data),
          method: "POST",
        }
      );

      const responseData = await response.json();
      return responseData.taskId;
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  }
  async open_jy(
    captchaId,
    captchaOutput,
    genTime,
    lotNumber,
    passToken,
    privateKey
  ) {
    try {
      const timestamp = Math.floor(Date.now() / 1e3);
      const signature = await this.signMessage_open(privateKey, timestamp);
      let wallet = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      let address = wallet.address.toLowerCase();

      const data = {
        userAddress: address,
        timestamp: timestamp,
        signature: signature,
      };

      const response = await fetch(
        "https://mint.caduceus.foundation/api/v2/lottery",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh,zh-CN;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            pragma: "no-cache",
            priority: "u=1, i",
            "G-Captcha-Id": captchaId,
            "G-Captcha-Output": captchaOutput,
            "G-Gen-Time": genTime,
            "G-Lot-Number": lotNumber,
            "G-Pass-Token": passToken,
            cookie: "selectWallet=OKX",
            Referer: "https://mint.caduceus.foundation/",
            "Referrer-Policy": "origin",
          },
          body: JSON.stringify(data),
          method: "POST",
        }
      );

      const responseData = await response.json();
      return responseData.taskId;
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  }

  async task(taskId) {
    let times = 0;
    while (times < 120) {
      try {
        const response = await fetch(
          "https://mint.caduceus.foundation/api/v2/lottery/status?taskId=" +
            taskId,
          {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh,zh-CN;q=0.9,en;q=0.8",
              "cache-control": "no-cache",
              pragma: "no-cache",
              priority: "u=1, i",
              "sec-ch-ua-mobile": "?0",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              cookie: "selectWallet=OKX",
              Referer: "https://mint.caduceus.foundation/",
              "Referrer-Policy": "origin",
            },
            body: null,
            method: "GET",
          }
        );
        const result = await response.json();

        if (result.data.status === 2) {
          console.log("[木鱼提示]签到成功");
          return "[木鱼提示]签到成功";
        } else {
          console.log("[木鱼提示]签到中->", result);
        }
      } catch (error) {
        console.log(error);
      }
      times += 2;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 等待2秒钟
    }
  }

  async invite(token, inviter, privateKey) {
    let wallet = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    let invitee = wallet.address.toLowerCase();

    const signature = await this.signInviteMessage(inviter, invitee);
    try {
      const data = {
        inviter: inviter,
        invitee: invitee,
        signature: signature,
      };
      const response = await fetch(
        "https://mint.caduceus.foundation/api/v1/user/invite",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh,zh-CN;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            pragma: "no-cache",
            priority: "u=1, i",
            "r-token": token,
            "sec-ch-ua":
              '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            cookie: "selectWallet=OKX",
            Referer: "https://mint.caduceus.foundation/",
            "Referrer-Policy": "origin",
          },
          body: `{"inviter":"${inviter}","invitee":"${invitee}","signature":"${signature}"}`,
          method: "POST",
        }
      );
      const responseData = await response.json();
      return responseData;
    } catch (error) {}
  }
  async invite_jy(
    captchaId,
    captchaOutput,
    genTime,
    lotNumber,
    passToken,
    inviter,
    privateKey
  ) {
    let wallet = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    let invitee = wallet.address.toLowerCase();

    const signature = await this.signInviteMessage(inviter, invitee);
    try {
      const data = {
        inviter: inviter,
        invitee: invitee,
        signature: signature,
      };
      const response = await fetch(
        "https://mint.caduceus.foundation/api/v1/user/invite",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh,zh-CN;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            pragma: "no-cache",
            priority: "u=1, i",
            "G-Captcha-Id": captchaId,
            "G-Captcha-Output": captchaOutput,
            "G-Gen-Time": genTime,
            "G-Lot-Number": lotNumber,
            "G-Pass-Token": passToken,
            "sec-ch-ua":
              '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            cookie: "selectWallet=OKX",
            Referer: "https://mint.caduceus.foundation/",
            "Referrer-Policy": "origin",
          },
          body: `{"inviter":"${inviter}","invitee":"${invitee}","signature":"${signature}"}`,
          method: "POST",
        }
      );
      const responseData = await response.json();
      return responseData;
    } catch (error) {}
  }
}

function b(T) {
  const I = [];
  for (let S = 0; S < T.length; S++) I.push(T[S]);
  let k = "";
  for (; I.length > 0; ) k += I.pop();
  return k;
}

export default Cad;
