class Ttorc {
  constructor(appkey, devkey, itemid, captcha_id) {
    this.appkey = appkey;
    this.devkey = devkey;
    this.itemid = itemid;
    this.captcha_id = captcha_id;
  }

  async createTask() {
    try {
      const url = "http://api.ttocr.com/api/recognize";
      const data = {
        appkey: this.appkey,
        gt: this.captcha_id,
        itemid: this.itemid,
        devkey: this.devkey,
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const resultid = result.resultid;
      if (resultid) {
        return resultid;
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getResponse(resultid) {
    let times = 0;
    while (times < 120) {
      try {
        const url = "http://api.ttocr.com/api/results";
        const data = {
          appkey: this.appkey,
          resultid: resultid,
        };
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.status === 4016 || result.status === 4026) {
          return "识别失败";
        }
        const jy_rep = result.data;
        if (jy_rep) {
          return jy_rep;
        } else {
          console.log("[木鱼提示]验证中->", result);
        }
      } catch (error) {
        console.log(error);
      }
      times += 3;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 等待3秒钟
    }
  }
}

export default Ttorc;
