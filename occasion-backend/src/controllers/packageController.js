const { CateringPackage } = require("../models");

async function getPackages(req, res) {
  try {
    const packages = await CateringPackage.findAll({
      order: [["package_id", "ASC"]],
    });

    res.status(200).json(packages);
  } catch (error) {
    console.error("Error retrieving catering packages:", error);

    res.status(500).json({
      message: "Failed to retrieve catering packages",
    });
  }
}

module.exports = {
  getPackages,
};