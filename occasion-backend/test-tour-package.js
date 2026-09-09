const { TourPackage } = require("./src/models");

async function testTourPackageRelationships() {
  try {
    const tourPackages = await TourPackage.findAll({
      include: [
        "TourOperator",
        "CateringPackage",
      ],
    });

    console.log(
      JSON.stringify(
        tourPackages.map((tourPackage) => tourPackage.toJSON()),
        null,
        2
      )
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testTourPackageRelationships();