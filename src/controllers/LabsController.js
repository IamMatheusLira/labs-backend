const Lab = require("../models/Lab");

const LAB_STATUS = ["ativo", "inativo"];

class LabsController {
  async findAll(req, res) {
    const labs = await Lab.findAll({ where: { status: "ativo" } });
    return res.status(200).send(labs);
  }

  async create(req, res) {
    const { name, address } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .send({ error: true, message: "Name cannot be blank", lab: null });
    }

    if (!address || address.trim() === "") {
      return res
        .status(400)
        .send({ error: true, message: "Address cannot be blank", lab: null });
    }

    try {
      const lab = await Lab.create({ name, address });
      return res.status(201).send({
        error: false,
        message: `Successfully created lab`,
        lab,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        error: true,
        message: "Unable to create Lab",
        lab: null,
      });
    }
  }

  async update(req, res) {
    const { id, name, address, status } = req.body;

    if (!id) {
      return res.status(400).send({
        error: true,
        message: "Update is only possible with id",
        lab: null,
      });
    }

    if (!LAB_STATUS.includes(status)) {
      return res.status(400).send({
        error: true,
        message: "Status must be 'ativo' or 'inativo'",
        lab: null,
      });
    }

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .send({ error: true, message: "Name cannot be blank", lab: null });
    }

    if (!address || address.trim() === "") {
      return res
        .status(400)
        .send({ error: true, message: "Address cannot be blank", lab: null });
    }

    try {
      const lab = await Lab.findOne({ id });
      if (!lab) {
        return res.status(400).send({
          error: true,
          message: "Does not have this lab",
          lab: null,
        });
      }

      await Lab.update({ name, address, status }, { where: { id: lab.id } });
      return res.status(200).send({
        error: false,
        message: `Successfully updated lab`,
        lab: {
          id: lab.id,
          name,
          address,
          status,
        },
      });
    } catch (error) {
      return res.status(400).send({
        error: true,
        message: "Unable to update",
        lab: null,
      });
    }
  }

  async delete(req, res) {
    const { id } = req.body;
    const DELETE_STATUS = "inativo";

    if (!id) {
      return res.status(400).send({
        error: true,
        message: "Delete is only possible with id",
        lab: null,
      });
    }

    try {
      const lab = await Lab.findOne({ id });
      if (!lab) {
        return res.status(400).send({
          error: true,
          message: "Does not have this lab",
          lab: null,
        });
      }

      await Lab.update({ status: DELETE_STATUS }, { where: { id: lab.id } });
      return res.status(200).send({
        error: false,
        message: `Successfully deleted lab`,
        lab: {
          id: lab.id,
          name: lab.name,
          status: DELETE_STATUS,
        },
      });
    } catch (error) {
      return res.status(400).send({
        error: true,
        message: "Unable to delete",
        lab: null,
      });
    }
  }
}

module.exports = new LabsController();
