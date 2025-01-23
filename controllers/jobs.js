const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs });
};

const getJob = async (req, res) => {
  res.send("getJob route");
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  res.send("updateJob route");
};

const deleteJob = async (req, res) => {
  res.send("deleteJob route");
};

module.exports = {
  getAllJobs,
  getJob,
  updateJob,
  createJob,
  deleteJob,
};
