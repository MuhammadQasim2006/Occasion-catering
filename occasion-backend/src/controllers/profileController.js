const {
  User,
  Customer,
} = require("../models");

async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: [
        "user_id",
        "email",
        "role",
        "created_at",
      ],
      include: [
        {
          model: Customer,
          attributes: [
            "customer_id",
            "first_name",
            "last_name",
            "phone",
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving profile:", error);

    return res.status(500).json({
      message: "Failed to retrieve profile",
    });
  }
}

async function updateProfile(req, res) {
  try {
    const {
      first_name,
      last_name,
      phone,
    } = req.body;

    const customer = await Customer.findOne({
      where: {
        user_id: req.user.user_id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer profile not found",
      });
    }

    if (
      first_name !== undefined &&
      (!first_name || typeof first_name !== "string")
    ) {
      return res.status(400).json({
        message: "first_name must be a non-empty string",
      });
    }

    if (
      last_name !== undefined &&
      (!last_name || typeof last_name !== "string")
    ) {
      return res.status(400).json({
        message: "last_name must be a non-empty string",
      });
    }

    if (
      phone !== undefined &&
      phone !== null &&
      typeof phone !== "string"
    ) {
      return res.status(400).json({
        message: "phone must be a string or null",
      });
    }

    const updates = {};

    if (first_name !== undefined) {
      updates.first_name = first_name.trim();
    }

    if (last_name !== undefined) {
      updates.last_name = last_name.trim();
    }

    if (phone !== undefined) {
      updates.phone = phone === null ? null : phone.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No profile fields were provided",
      });
    }

    await customer.update(updates);

    const updatedUser = await User.findByPk(
      req.user.user_id,
      {
        attributes: [
          "user_id",
          "email",
          "role",
          "created_at",
        ],
        include: [
          {
            model: Customer,
            attributes: [
              "customer_id",
              "first_name",
              "last_name",
              "phone",
            ],
          },
        ],
      }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};