const { Payment } = require("./src/models");

async function testPaymentRelationship() {
  try {
    const payments = await Payment.findAll({
      include: ["Booking"],
    });

    console.log(
      JSON.stringify(
        payments.map((payment) => payment.toJSON()),
        null,
        2
      )
    );
  } catch (error) {
    console.error("Error retrieving payment relationships:");
    console.error(error.message);
  }
}

testPaymentRelationship();