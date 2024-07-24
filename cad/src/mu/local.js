class Mucoin {
  constructor(appkey, project_type, captcha_id) {
    this.appkey = appkey;
    this.project_type = project_type;
    this.captcha_id = captcha_id;
    this.baseUrl = "http://127.0.0.1:8000";
  }

  async createTask() {
    try {
      const url = this.baseUrl + "/api/recognize";
      const data = {
        project_type: this.project_type,
        captcha_id: this.captcha_id,
        challenge: "",
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.appkey,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const resultid = result.result_id;
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
        const url = this.baseUrl + "/api/task";
        const data = {
          result_id: resultid,
        };
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.appkey,
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();

        const jy_rep = result.status;
        if (jy_rep === "success") {
          return result.result;
        } else if (jy_rep === "error") {
          return undefined;
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

export default Mucoin;
