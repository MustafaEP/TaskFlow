const Project = require("../models/Project");

const checkProjectOwnership = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
  });

  return project;
};

module.exports = {
  checkProjectOwnership,
};
