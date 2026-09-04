const { Booking } = require("./src/models");

async function testCustomerBookings() {
  try {
    const bookings = await Booking.findAll({
      where: {
        customer_id: 1,
      },
      include: "Customer",
    });

    console.log(
      JSON.stringify(
        bookings.map((booking) => booking.toJSON()),
        null,
        2
      )
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testCustomerBookings();