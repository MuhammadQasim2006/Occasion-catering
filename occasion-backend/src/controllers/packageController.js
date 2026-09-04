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
          order: [["menu_item_id", "ASC"]],
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

module.exports = {
  getPackages,
};