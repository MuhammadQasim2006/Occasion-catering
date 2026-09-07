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

async function updateBookingStatus(req, res) {
  try {
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        message: "Booking ID must be a positive integer",
      });
    }

    const allowedStatuses = [
      "pending",
      "confirmed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "status must be one of: pending, confirmed, cancelled",
      });
    }

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    await booking.update({
      status,
    });

    return res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);

    return res.status(500).json({
      message: "Failed to update booking status",
    });
  }
}

module.exports = {
  getAllBookings,
  updateBookingStatus,
};