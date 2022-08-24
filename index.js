//---------------- With clustering
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

//-----------------------------------

//---------------- Without clustering
// const express = require("express");
// const app = express();
// const port = 3000;

// app.get("/api/sum", (req, res) => {
//   const maxValue = 100000000;
//   let sum = 0;
//   for (let i = 0; i < maxValue; i++) {
//     sum = sum + i;
//   }
//   res.send(`Final sum is : ${sum}`);
// });

// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });

//-----------------------------------
