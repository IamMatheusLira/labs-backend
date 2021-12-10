const Lab = require("../models/Lab");

const LAB_STATUS = ["active", "inactive"];

class LabsController {
  async findAll(req, res) {
    const labs = await Lab.findAll({ where: { status: "active" } });
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
      return res.status(400).send({
        error: true,
        message: "Unable to create Lab",
        lab: null,
      });
    }
  }

  async lotCreate(req, res) {
    const { labs } = req.body;

    if (!labs || labs.length < 1) {
      return res.status(400).send({
        error: true,
        message: "Must send at least one item",
        warning: null,
        labs: null,
      });
    }

    let rightLabs = [];
    let wrongLabs = [];
    try {
      const createLabs = async (name, address) => {
        const lab = await Lab.create({ name, address });
        rightLabs.push(lab);
      };
      const insertLabs = labs.map((item) => {
        if (
          !item.name ||
          item.name.trim() === "" ||
          !item.address ||
          item.address.trim() === ""
        ) {
          return wrongLabs.push(item);
        }

        return createLabs(item.name, item.address);
      });
      await Promise.all(insertLabs);
      return res.status(201).send({
        error: false,
        message: "Successfully created Labs",
        warning: wrongLabs.length > 0 ? wrongLabs : null,
        labs: rightLabs,
      });
    } catch (error) {
      return res.status(400).send({
        error: true,
        message: "Something went wrong",
        warning: null,
        labs: null,
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
        message: "Status must be 'active' or 'inactive'",
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

  async lotUpdate(req, res) {
    const { labs } = req.body;

    if (!labs || labs.length < 1) {
      return res.status(400).send({
        error: true,
        message: "Must send at least one item",
        warning: null,
        labs: null,
      });
    }

    try {
      let rightLabs = [];
      let wrongLabs = [];
      const updateLabs = async (id, name, address, status) => {
        const lab = await Lab.findOne({
          where: { id },
          attributes: ["id", "name", "address", "status"],
        });
        if (!lab) {
          return wrongLabs.push({
            message: "Does not have this lab",
            lab: lab,
          });
        }

        await Lab.update({ name, address, status }, { where: { id } });
        return rightLabs.push({
          id: lab.id,
          name,
          address,
          status,
        });
      };
      const updatePromise = labs.map((item) => {
        if (
          !item.id ||
          !item.status ||
          !LAB_STATUS.includes(item.status) ||
          !item.name ||
          item.name.trim() === "" ||
          !item.address ||
          item.address.trim() === ""
        ) {
          return wrongLabs.push({ message: "worng parameters", lab: item });
        }

        return updateLabs(item.id, item.name, item.address);
      });
      await Promise.all(updatePromise);
      return res.status(201).send({
        error: false,
        message: "Successfully updated Labs",
        warning: wrongLabs.length > 0 ? wrongLabs : null,
        labs: rightLabs,
      });
    } catch (error) {
      return res.status(400).send({
        error: true,
        message: "Something went wrong",
        warning: null,
        labs: null,
      });
    }
  }

  async delete(req, res) {
    const { id } = req.body;
    const DELETE_STATUS = "inactive";

    if (!id) {
      return res.status(400).send({
        error: true,
        message: "Delete is only possible with id",
        lab: null,
      });
    }

    try {
      const lab = await Lab.findOne({ where: { id } });
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

  async lotDelete(req, res) {
    const { labs } = req.body;

    if (!labs || labs.length < 1) {
      return res.status(400).send({
        error: true,
        message: "Must send at least one item",
        warning: null,
        labs: null,
      });
    }
    const DELETE_STATUS = "inactive";

    let rightLabs = [];
    let wrongLabs = [];
    try {
      const deleteLabs = async (id) => {
        const lab = await Lab.findOne({ where: { id } });
        if (!lab) {
          return wrongLabs.push({ message: "Missing lab", lab });
        }
        await Lab.update({ status: DELETE_STATUS }, { where: { id: lab.id } });
        rightLabs.push({
          id: lab.id,
          name: lab.name,
          status: DELETE_STATUS,
        });
      };

      const deletePromise = labs.map((item) => {
        if (!item.id) {
          return wrongLabs.push({ message: "Missing parameters", lab: item });
        }

        return deleteLabs(item.id);
      });

      await Promise.all(deletePromise);
      return res.status(201).send({
        error: false,
        message: `Successfully deleted Labs with ${wrongLabs.length} warnings`,
        warning: wrongLabs.length > 0 ? wrongLabs : null,
        labs: rightLabs,
      });
    } catch (error) {
      return res.status(400).send({
        error: true,
        message: "Something went wrong",
        warning: null,
        labs: null,
      });
    }
  }
}

module.exports = new LabsController();
