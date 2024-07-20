class YesCaptch {
  constructor(clientKey, websiteKey, websiteUrl, taskType) {
    this.websiteKey = websiteKey;
    this.websiteUrl = websiteUrl;
    this.taskType = taskType;
    this.clientKey = clientKey;
  }

  async createTask() {
    try {
      const url = "https://api.yescaptcha.com/createTask";
      const data = {
        clientKey: this.clientKey,
        task: {
          websiteURL: this.websiteUrl,
          websiteKey: this.websiteKey,
          type: this.taskType,
        },
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const taskId = result.taskId;
      if (taskId) {
        return taskId;
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getResponse(taskID) {
    let times = 0;
    while (times < 120) {
      try {
        const url = "https://api.yescaptcha.com/getTaskResult";
        const data = {
          clientKey: this.clientKey,
          taskId: taskID,
        };
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        const solution = result.solution;
        if (solution) {
          const response = solution.gRecaptchaResponse;
          if (response) {
            return response;
          }
        } else {
          console.log("[木鱼提示]验证中->", result);
        }
      } catch (error) {
        console.log(error);
      }
      times += 3;
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 等待3秒钟
    }
  }
}

export default YesCaptch;
