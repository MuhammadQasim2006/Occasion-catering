const {
  Booking,
  Customer,
  BookingItem,
  CateringPackage,
  MenuItem,
  Payment,
} = require("../models");

const sequelize = require("../config/db");

async function createBooking(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const {
      customer_id,
      event_date,
      guest_count,
      event_type,
      package_id,
      menu_item_ids = [],
    } = req.body;

    if (!Number.isInteger(customer_id) || customer_id <= 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "customer_id must be a positive integer",
      });
    }

    if (!event_date) {
      await transaction.rollback();

      return res.status(400).json({
        message: "event_date is required",
      });
    }

    const parsedGuestCount = Number(guest_count);

    if (
      !Number.isInteger(parsedGuestCount) ||
      parsedGuestCount <= 0
    ) {
      await transaction.rollback();

      return res.status(400).json({
        message: "guest_count must be a positive integer",
      });
    }

    if (!event_type || typeof event_type !== "string") {
      await transaction.rollback();

      return res.status(400).json({
        message: "event_type is required",
      });
    }

    if (!Number.isInteger(package_id) || package_id <= 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "package_id must be a positive integer",
      });
    }

    if (!Array.isArray(menu_item_ids)) {
      await transaction.rollback();

      return res.status(400).json({
        message: "menu_item_ids must be an array",
      });
    }

    const customer = await Customer.findByPk(customer_id, {
      transaction,
    });

    if (!customer) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const cateringPackage = await CateringPackage.findByPk(package_id, {
      include: [
        {
          model: MenuItem,
          attributes: [
            "menu_item_id",
            "name",
            "price_addon",
            "is_default",
          ],
        },
      ],
      transaction,
    });

    if (!cateringPackage) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Catering package not found",
      });
    }

    const selectedMenuItemIds = [...new Set(menu_item_ids)];

    const selectedMenuItems = cateringPackage.MenuItems.filter(
      (menuItem) =>
        selectedMenuItemIds.includes(menuItem.menu_item_id)
    );

    if (
      selectedMenuItems.length !==
      selectedMenuItemIds.length
    ) {
      await transaction.rollback();

      return res.status(400).json({
        message:
          "One or more selected menu items do not belong to this package",
      });
    }

    const packagePrice = Number(cateringPackage.base_price);

    const menuItemsTotal = selectedMenuItems.reduce(
      (total, menuItem) =>
        total + Number(menuItem.price_addon),
      0
    );

    const totalAmount = packagePrice + menuItemsTotal;

    const booking = await Booking.create(
      {
        customer_id,
        event_date,
        guest_count: parsedGuestCount,
        event_type: event_type.trim(),
        status: "pending",
        total_amount: totalAmount.toFixed(2),
      },
      {
        transaction,
      }
    );

    await BookingItem.create(
      {
        booking_id: booking.booking_id,
        package_id: cateringPackage.package_id,
        menu_item_id: null,
        quantity: 1,
        line_total: packagePrice.toFixed(2),
      },
      {
        transaction,
      }
    );

    for (const menuItem of selectedMenuItems) {
      await BookingItem.create(
        {
          booking_id: booking.booking_id,
          package_id: cateringPackage.package_id,
          menu_item_id: menuItem.menu_item_id,
          quantity: 1,
          line_total: Number(menuItem.price_addon).toFixed(2),
        },
        {
          transaction,
        }
      );
    }

    await transaction.commit();

    const createdBooking = await Booking.findByPk(
      booking.booking_id,
      {
        include: [
          {
            model: Customer,
          },
          {
            model: BookingItem,
            include: [
              {
                model: CateringPackage,
              },
              {
                model: MenuItem,
              },
            ],
          },
          {
            model: Payment,
          },
        ],
      }
    );

    return res.status(201).json(createdBooking);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    console.error("Error creating booking:", error);

    return res.status(500).json({
      message: "Failed to create booking",
    });
  }
}

async function getCustomerBookings(req, res) {
  try {
    const customerId = Number(req.params.customerId);

    if (!Number.isInteger(customerId) || customerId <= 0) {
      return res.status(400).json({
        message: "Customer ID must be a positive integer",
      });
    }

    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const bookings = await Booking.findAll({
      where: {
        customer_id: customerId,
      },
      order: [
        ["event_date", "DESC"],
        ["booking_id", "DESC"],
      ],
      include: [
        {
          model: BookingItem,
          include: [
            {
              model: CateringPackage,
            },
            {
              model: MenuItem,
            },
          ],
        },
        {
          model: Payment,
        },
      ],
    });

    return res.status(200).json({
      customer: customer,
      bookings: bookings,
    });
  } catch (error) {
    console.error("Error retrieving customer bookings:", error);

    return res.status(500).json({
      message: "Failed to retrieve customer bookings",
    });
  }
}

async function getBookingById(req, res) {
  try {
    const bookingId = Number(req.params.id);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        message: "Booking ID must be a positive integer",
      });
    }

    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Customer,
        },
        {
          model: BookingItem,
          include: [
            {
              model: CateringPackage,
            },
            {
              model: MenuItem,
            },
          ],
        },
        {
          model: Payment,
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error("Error retrieving booking:", error);

    return res.status(500).json({
      message: "Failed to retrieve booking",
    });
  }
}

module.exports = {
  createBooking,
  getCustomerBookings,
  getBookingById,
};