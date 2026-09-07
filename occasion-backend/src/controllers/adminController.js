const {
  Booking,
  Customer,
  BookingItem,
  CateringPackage,
  MenuItem,
  Payment,
} = require("../models");

async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.findAll({
      order: [
        ["created_at", "DESC"],
        ["booking_id", "DESC"],
      ],
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

    return res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error("Error retrieving all bookings:", error);

    return res.status(500).json({
      message: "Failed to retrieve bookings",
    });
  }
}

module.exports = {
  getAllBookings,
};