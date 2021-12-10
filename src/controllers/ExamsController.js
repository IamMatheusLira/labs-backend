const Exam = require("../models/Exam");
const Lab = require("../models/Lab");

const EXAM_TYPES = ["clinicalAnalysis", "image"];
const EXAM_STATUS = ["active", "inactive"];

class ExamsController {
  async findOne(req, res) {
    const { name } = req.params;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .send({ error: true, message: "Name cannot be blank", exam: null });
    }

    try {
      const exam = await Exam.findOne({
        where: { name, status: "active" },
        include: [
          {
            model: Lab,
            as: "labs",
            through: { attributes: [] },
          },
        ],
      });
      if (!exam) {
        return res.status(200).send({
          error: true,
          message: "Does not have this Exam",
          exam: null,
        });
      }
      return res.status(200).send({
        error: false,
        message: `Successfully find Exam`,
        exam,
      });
    } catch (error) {
      return res.status(400).send({
        error: false,
        message: "Unable to find Exam",
        exam: null,
      });
    }
  }

  async findAll(req, res) {
    try {
      const exams = await Exam.findAll({ where: { status: "active" } });
      return res
        .status(200)
        .send({ error: false, message: "Successfully get exams", exams });
    } catch (error) {
      return res.status(500).send({
        error: true,
        message: "Something Went Wrong",
        lab: null,
      });
    }
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
      const exam = await Exam.findOne({ where: { name } });
      if (exam) {
        return res.status(400).send({
          error: true,
          message: "Already have an exam with that name",
          exam: exam,
        });
      } else {
        const newExam = await Exam.create({ name, type });
        return res.status(201).send({
          error: false,
          message: `Successfully created Exam`,
          newExam,
        });
      }
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
      const exam = await Exam.findOne({ where: { id } });
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
          id: exam.id,
          name: exam.name,
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

  async associate(req, res) {
    const { exam, lab } = req.body;

    if (!exam || !lab || !exam.id || !lab.id) {
      return res.status(400).send({
        error: true,
        message: "Missing parameters",
      });
    }

    try {
      const findExam = await Exam.findOne({
        where: { id: exam.id, status: "active" },
        attributes: ["id", "name"],
      });
      if (!findExam) throw { message: "Does not have this Exam" };

      const findLab = await Lab.findOne({
        where: { id: lab.id, status: "active" },
        attributes: ["id", "name"],
      });
      if (!findLab) throw { message: "Does not have this Lab" };

      findExam.addLab(findLab.id);
      return res.status(200).send({
        error: false,
        message: "Successfully associating Lab to Exam",
        exam: findExam,
        lab: findLab,
      });
    } catch (error) {
      return res.status(400).send({
        error: true,
        message: error.message ? error.message : "Something went Wrong",
      });
    }
  }

  async disassociate(req, res) {
    const { exam, lab } = req.body;

    if (!exam || !lab || !exam.id || !lab.id) {
      return res.status(400).send({
        error: true,
        message: "Missing parameters",
      });
    }

    try {
      const findExam = await Exam.findOne({
        where: { id: exam.id, status: "active" },
        attributes: ["id", "name"],
      });
      if (!findExam) throw { message: "Does not have this Exam" };

      const findLab = await Lab.findOne({
        where: { id: lab.id, status: "active" },
        attributes: ["id", "name"],
      });
      if (!findLab) throw { message: "Does not have this Lab" };

      findExam.removeLab(findLab.id);
      return res.status(200).send({
        error: false,
        message: "Successfully disassociating Lab to Exam",
        exam: findExam,
      });
    } catch (error) {
      return res.status(400).send({
        error: true,
        message: error.message ? error.message : "Something went Wrong",
      });
    }
  }
}

module.exports = new ExamsController();
