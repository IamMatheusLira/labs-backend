require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./database");

class Server {
  constructor(port = 3001, app, sequelize) {
    this.port = port;
    this.app = app;
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
  }

  setRoutes() {
    this.app.get("/api", (req, res) => res.send({ message: "Hello Labs" }));
    this.app.use("/api/labs", require("./routes/LabsRouter.js"));
    this.app.use("/api/exams", require("./routes/ExamsRouter.js"));
  }

  connectDb() {
    this.sequelize.sync().then(() => {
      console.log("DB connected");
    });
  }
}

const server = new Server(process.env.SERVER_PORT, express(), sequelize);
server.init();
