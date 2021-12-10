const express = require("express");
const examsController = require("../controllers/ExamsController");

class ExamsRouter {
  constructor(router, examsController) {
    this.router = router;
    this.examsController = examsController;
    this.setupRouter();
  }

  setupRouter() {
    this.router.get("/", examsController.findAll);
    this.router.get("/:name", examsController.findOne);
    this.router.post("/", examsController.create);
    this.router.put("/", examsController.update);
    this.router.delete("/", examsController.delete);
    this.router.put("/associate", examsController.associate);
    this.router.put("/disassociate", examsController.disassociate);
  }
}

const examRouter = new ExamsRouter(express.Router(), examsController);
module.exports = examRouter.router;
