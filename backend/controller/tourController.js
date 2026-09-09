const {
  TourPackage,
  TourOperator,
  CateringPackage,
  Category,
  MenuItem,
} = require("../models");

async function getAllTours(req, res) {
  try {
    const { operator_id } = req.query;

    const where = {};

    if (operator_id !== undefined) {
      const parsedOperatorId = Number(operator_id);

      if (
        !Number.isInteger(parsedOperatorId) ||
        parsedOperatorId <= 0
      ) {
        return res.status(400).json({
          message:
            "operator_id must be a positive integer",
        });
      }

      where.operator_id = parsedOperatorId;
    }

    const tours = await TourPackage.findAll({
      where,
      order: [["tour_package_id", "ASC"]],
      include: [
        {
          model: TourOperator,
          attributes: [
            "operator_id",
            "company_name",
            "contact_email",
            "contact_phone",
          ],
        },
        {
          model: CateringPackage,
          attributes: [
            "package_id",
            "category_id",
            "name",
            "description",
            "base_price",
            "event_size",
            "image_url",
          ],
          include: [
            {
              model: Category,
              attributes: [
                "category_id",
                "name",
              ],
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
        },
      ],
    });

    return res.status(200).json({
      tours,
    });
  } catch (error) {
    console.error(
      "Error retrieving tours:",
      error
    );

    return res.status(500).json({
      message: "Failed to retrieve tours",
    });
  }
}

async function getTourById(req, res) {
  try {
    const tourPackageId = Number(req.params.id);

    if (
      !Number.isInteger(tourPackageId) ||
      tourPackageId <= 0
    ) {
      return res.status(400).json({
        message:
          "Tour package ID must be a positive integer",
      });
    }

    const tour = await TourPackage.findByPk(
      tourPackageId,
      {
        include: [
          {
            model: TourOperator,
            attributes: [
              "operator_id",
              "company_name",
              "contact_email",
              "contact_phone",
            ],
          },
          {
            model: CateringPackage,
            attributes: [
              "package_id",
              "category_id",
              "name",
              "description",
              "base_price",
              "event_size",
              "image_url",
            ],
            include: [
              {
                model: Category,
                attributes: [
                  "category_id",
                  "name",
                ],
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
          },
        ],
      }
    );

    if (!tour) {
      return res.status(404).json({
        message: "Tour package not found",
      });
    }

    return res.status(200).json({
      tour,
    });
  } catch (error) {
    console.error(
      "Error retrieving tour package:",
      error
    );

    return res.status(500).json({
      message: "Failed to retrieve tour package",
    });
  }
}

module.exports = {
  getAllTours,
  getTourById,
};