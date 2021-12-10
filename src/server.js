require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const sequelize = require("./database");

class Server {
  constructor(port = 3001, app, sequelize, swagger) {
    this.port = port;
    this.app = app;
    this.swagger = swagger;
    this.sequelize = sequelize;
  }

  async init() {
    this.setupExpress();
    this.setRoutes();
    this.connectDb();

    this.app.listen(this.port, () =>
      console.log(`App is running on port ${this.port}`)
    );
  }

  setupExpress() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.urlencoded());
  }

  setRoutes() {
    this.app.get("/api", (req, res) => res.send({ message: "Hello Labs" }));
    this.app.use(
      "/api/docs",
      this.swagger.serve,
      this.swagger.setup(require("../swagger.json"))
    );
    this.app.use("/api/labs", require("./routes/LabsRouter.js"));
    this.app.use("/api/exams", require("./routes/ExamsRouter.js"));
  }

  connectDb() {
    this.sequelize.sync().then(() => {
      console.log("DB connected");
    });
  }
}

const server = new Server(
  process.env.SERVER_PORT,
  express(),
  sequelize,
  swaggerUI
);
server.init();
