## Improving Node.js Application Performance With Clustering

When building a production application, you are usually on the lookout for ways to optimize its performance while keeping any possible trade-offs in mind. When it is live, you'll want to use a Node.js APM. In this post, we'll take a look at an approach that can give you a quick win when it comes to improving the way your Node.js apps handle the workload.

An instance of Node.js runs in a single thread which means that on a multi-core system (which most computers are these days), not all cores will be utilized by the app. To take advantage of the other available cores, you can launch a cluster of Node.js processes and distribute the load between them.

Having multiple threads to handle requests improves the throughput (requests/second) of your server as several clients can be served concurrently. We'll see how to create child processes with the Node.js cluster module and then later, we'll take a look at how to manage clustering with the PM2 Process Manager.

## How to start?

We will create a simple NodeJS + Express REST API server.

```
npm init
npm i express nodemon
```

## Without clustering (Single Thread)

Create a new file named **index.js** and replace the with the code below:

```
const express = require("express");
const app = express();
const port = 3000;

app.get("/api/sum", (req, res) => {
  const maxValue = 100000000;
  let sum = 0;
  for (let i = 0; i < maxValue; i++) {
    sum = sum + i;
  }
  res.send(`Final sum is : ${sum}`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

```

Start the server:

```
npm start
```

### Here, we created a simple API which will return us total sum of **0 to maxValue**

![Mahbubur Rahman Turzo](/screenshots/s1.png?raw=true "Mahbubur Rahman Turzo")

## Time to Load Test!

Install a simple npm plugin or package to simulate the load test.

Install globally as root:

```
npm install -g loadtest
```

On Ubuntu or Mac OS X systems install using sudo:

```
sudo npm install -g loadtest
```

Now, open a Terminal and write the command below to start load test of your server:

```
loadtest -n 1000 -c 100 http://localhost:3000/api/sum
```

![Mahbubur Rahman Turzo](/screenshots/s2.png?raw=true "Mahbubur Rahman Turzo")

### Our default server took 227+ seconds to complete all the concurrent hits with a single thread behaviour.

## With Clustering (Multi Threads)

Create a new file named **index.js** and replace the with the code below:

```
const express = require("express");
const app = express();
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const port = 3000;

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  app.get("/api/sum", (req, res) => {
    const maxValue = 100000000;
    let sum = 0;
    for (let i = 0; i < maxValue; i++) {
      sum = sum + i;
    }
    res.send(`Final sum is : ${sum}`);
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

```

Start the server:

```
npm start
```

### Here, our NodeJS application will take advantages of all cores of our CPU and spawn its instance as many as possible to create multiple workers.

![Mahbubur Rahman Turzo](/screenshots/s3.png?raw=true "Mahbubur Rahman Turzo")

Now, open a Terminal and write the command below to start load test of your server:

```
loadtest -n 1000 -c 100 http://localhost:3000/api/sum
```

![Mahbubur Rahman Turzo](/screenshots/s4.png?raw=true "Mahbubur Rahman Turzo")

### **You can see the huge improvement practically!** It took only 38.5 seconds(based on our CPU streangth) and Request per seconds is 26 (previously was only 4).

It also improved the Mean latency!

## So the conclusion is, we can dramatically improve our NodeJS server performance by clustering or load balancing easily!

### !

For more details, visit [this](https://blog.appsignal.com/2021/02/03/improving-node-application-performance-with-clustering.html) link

# ------ Find Me -------------

- Email : turzoxpress@gmail.com
- Website : www.turzo.org
- Github : www.github.com/Turzoxpress
- LinkedIn: www.linkedin.com/in/turzoxpress
- Portfolio : https://turzoxpress.github.io/portfolio
- Resume : https://turzoxpress.github.io/resume
- Facebook: www.facebook.com/MahbuburRahmanTurzo
