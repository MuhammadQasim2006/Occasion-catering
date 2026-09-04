const {
  CateringPackage,
  Category,
  MenuItem,
} = require("../models");

async function getPackages(req, res) {
  try {
    const packages = await CateringPackage.findAll({
      order: [["package_id", "ASC"]],
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: MenuItem,
          attributes: [
            "menu_item_id",
            "name",
            "description",
            "price_addon",
            "is_default",
          ],
        },
      ],
    });

    res.status(200).json(packages);
  } catch (error) {
    console.error("Error retrieving catering packages:", error);

    res.status(500).json({
      message: "Failed to retrieve catering packages",
    });
  }
}

async function getPackageById(req, res) {
  try {
    const packageId = Number(req.params.id);

    if (!Number.isInteger(packageId) || packageId <= 0) {
      return res.status(400).json({
        message: "Package ID must be a positive integer",
      });
    }

    const cateringPackage = await CateringPackage.findByPk(packageId, {
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
        {
          model: MenuItem,
          attributes: [
            "menu_item_id",
            "name",
            "description",
            "price_addon",
            "is_default",
          ],
        },
      ],
    });

    if (!cateringPackage) {
      return res.status(404).json({
        message: "Catering package not found",
      });
    }

    return res.status(200).json(cateringPackage);
  } catch (error) {
    console.error("Error retrieving catering package:", error);

    return res.status(500).json({
      message: "Failed to retrieve catering package",
    });
  }
}

module.exports = {
  getPackages,
  getPackageById,
};