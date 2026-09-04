const { BookingItem } = require("./src/models");

async function testBookingItemRelationships() {
  try {
    const bookingItems = await BookingItem.findAll({
      where: {
        booking_id: 1,
      },
      include: [
        "Booking",
        "CateringPackage",
        "MenuItem",
      ],
    });

    console.log(
      JSON.stringify(
        bookingItems.map((item) => item.toJSON()),
        null,
        2
      )
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testBookingItemRelationships();