## How to Schedule a Job in Node Using node-cron?

Node-cron is a handy npm package which you can use to schedule jobs to run at specific times or intervals. It is most suitable for scheduling repetitive jobs such as email notifications, file downloads, and database backups.

### How to start?

We will create a simple NodeJS + Express REST API server where our server will hit one of our REST API in a certain interval (5 seconds) by cron job.

```
npm init
npm i express nodemon node-cron request
```

Create a new file named **index.js** and replace the with the code below:

```
const express = require("express");
const app = express();
const nodeCron = require("node-cron");
const request = require("request");

app.get("/", (req, res) => {
  res.send("Welcome to Node Scheduler server!");
});

const job = nodeCron.schedule("*/5 * * * * *", () => {
  request("http://localhost:3000/", function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);
    }
  });
});

app.listen(3000, () => {
  console.log("Server started!");
  job.start();
});

```

### To create correct cron expression, go to these websites:

[https://crontab.guru](https://crontab.guru/)

[https://crontab.cronhub.io](https://crontab.cronhub.io/)
