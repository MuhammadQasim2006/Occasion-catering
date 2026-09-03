const { CateringPackage } = require("./src/models");

async function testPackageMenuItems() {
  try {
    const packageData = await CateringPackage.findOne({
      where: { package_id: 1 },
      include: "MenuItems",
    });

    console.log(JSON.stringify(packageData.toJSON(), null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testPackageMenuItems();