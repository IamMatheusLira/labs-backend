const Exam = require("../models/Exam");

const EXAM_TYPES = ["clinicalAnalysis", "image"];
const EXAM_STATUS = ["active", "inactive"];

class ExamsController {
  async findAll(req, res) {
    const exams = await Exam.findAll({ where: { status: "active" } });
    return res.status(200).send(exams);
  }

  async create(req, res) {
    const { name, type } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .send({ error: true, message: "Name cannot be blank", exam: null });
    }

    if (!type || !EXAM_TYPES.includes(type)) {
      return res.status(400).send({
        error: true,
        message: "Type must be 'clinicalAnalysis' or 'image'",
        exam: null,
      });
    }

    try {
      console.log({ name, type });
      const exam = await Exam.create({ name, type });
      return res.status(201).send({
        error: false,
        message: `Successfully created Exam`,
        exam,
      });
    } catch (error) {
      return res.status(400).send({
        error: true,
        message: "Unable to create Exam",
        exam: null,
      });
    }
  }

  async update(req, res) {
    const { id, name, type, status } = req.body;

    if (!id) {
      return res.status(400).send({
        error: true,
        message: "Update is only possible with id",
        exam: null,
      });
    }

    if (!EXAM_STATUS.includes(status)) {
      return res.status(400).send({
        error: true,
        message: "Status must be 'active' or 'inactive'",
        exam: null,
      });
    }

    if (!EXAM_TYPES.includes(type)) {
      return res.status(400).send({
        error: true,
        message: "Type must be 'clinicalAnalysis' or 'image'",
        exam: null,
      });
    }

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .send({ error: true, message: "Name cannot be blank", exam: null });
    }

    try {
      const exam = await Exam.findOne({ id });
      if (!exam) {
        return res.status(400).send({
          error: true,
          message: "Does not have this Exam",
          exam: null,
        });
      }

      await Exam.update({ name, type, status }, { where: { id: exam.id } });
      return res.status(200).send({
        error: false,
        message: `Successfully updated Exam`,
        exam: {
          id: exam.id,
          name,
          type,
          status,
        },
      });
    } catch (error) {
      return res.status(400).send({
        error: true,
        message: "Unable to update",
        exam: null,
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
        exam: null,
      });
    }

    try {
      const exam = await Exam.findOne({ where: { id } });
      if (!exam) {
        return res.status(400).send({
          error: true,
          message: "Does not have this Exam",
          exam: null,
        });
      }

      await Exam.update({ status: DELETE_STATUS }, { where: { id: exam.id } });
      return res.status(200).send({
        error: false,
        message: `Successfully deleted Exam`,
        exam: {
          exam: exam.id,
          status: DELETE_STATUS,
        },
      });
    } catch (error) {
      return res.status(400).send({
        error: true,
        message: "Unable to delete",
        exam: null,
      });
    }
  }
}

module.exports = new ExamsController();
