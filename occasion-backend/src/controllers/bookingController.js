const {
  Booking,
  Customer,
  BookingItem,
  CateringPackage,
  MenuItem,
} = require("../models");

async function createBooking(req, res) {
  try {
    const {
      customer_id,
      event_date,
      guest_count,
      event_type,
      package_id,
      menu_item_ids = [],
    } = req.body;

    if (
      !Number.isInteger(customer_id) ||
      customer_id <= 0
    ) {
      return res.status(400).json({
        message: "customer_id must be a positive integer",
      });
    }

    if (!event_date) {
      return res.status(400).json({
        message: "event_date is required",
      });
    }

    const parsedGuestCount = Number(guest_count);

    if (
      !Number.isInteger(parsedGuestCount) ||
      parsedGuestCount <= 0
    ) {
      return res.status(400).json({
        message: "guest_count must be a positive integer",
      });
    }

    if (!event_type || typeof event_type !== "string") {
      return res.status(400).json({
        message: "event_type is required",
      });
    }

    if (!Number.isInteger(package_id) || package_id <= 0) {
      return res.status(400).json({
        message: "package_id must be a positive integer",
      });
    }

    if (!Array.isArray(menu_item_ids)) {
      return res.status(400).json({
        message: "menu_item_ids must be an array",
      });
    }

    const customer = await Customer.findByPk(customer_id);

    if (!customer) {
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
    });

    if (!cateringPackage) {
      return res.status(404).json({
        message: "Catering package not found",
      });
    }

    const selectedMenuItemIds = [...new Set(menu_item_ids)];

    const selectedMenuItems =
      cateringPackage.MenuItems.filter((menuItem) =>
        selectedMenuItemIds.includes(menuItem.menu_item_id)
      );

    if (selectedMenuItems.length !== selectedMenuItemIds.length) {
      return res.status(400).json({
        message: "One or more selected menu items do not belong to this package",
      });
    }

    const packagePrice = Number(cateringPackage.base_price);

    const menuItemsTotal = selectedMenuItems.reduce(
      (total, menuItem) =>
        total + Number(menuItem.price_addon),
      0
    );

    const totalAmount = packagePrice + menuItemsTotal;

    const booking = await Booking.create({
      customer_id,
      event_date,
      guest_count: parsedGuestCount,
      event_type: event_type.trim(),
      status: "pending",
      total_amount: totalAmount.toFixed(2),
    });

    await BookingItem.create({
      booking_id: booking.booking_id,
      package_id: cateringPackage.package_id,
      menu_item_id: null,
      quantity: 1,
      line_total: packagePrice.toFixed(2),
    });

    for (const menuItem of selectedMenuItems) {
      await BookingItem.create({
        booking_id: booking.booking_id,
        package_id: cateringPackage.package_id,
        menu_item_id: menuItem.menu_item_id,
        quantity: 1,
        line_total: Number(menuItem.price_addon).toFixed(2),
      });
    }

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
        ],
      }
    );

    return res.status(201).json(createdBooking);
  } catch (error) {
    console.error("Error creating booking:", error);

    return res.status(500).json({
      message: "Failed to create booking",
    });
  }
}

module.exports = {
  createBooking,
};