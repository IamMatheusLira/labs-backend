const express = require("express");
const labsController = require("../controllers/LabsController");

class LabsRouter {
  constructor(router, labsController) {
    this.router = router;
    this.labsController = labsController;
    this.setupRouter();
  }

  setupRouter() {
    this.router.get("/", labsController.findAll);
    this.router.post("/", labsController.create);
    this.router.post("/lot", labsController.lotCreate);
    this.router.put("/", labsController.update);
    this.router.put("/lot", labsController.lotUpdate);
    this.router.delete("/", labsController.delete);
    this.router.delete("/lot", labsController.lotDelete);
  }
}

const labsRouter = new LabsRouter(express.Router(), labsController);
module.exports = labsRouter.router;
