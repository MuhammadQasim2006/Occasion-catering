const { Category, CateringPackage } = require("./src/models");

async function testCategoryPackages() {
  try {
    const category = await Category.findOne({
      where: { category_id: 1 },
      include: CateringPackage,
    });

    console.log(JSON.stringify(category.toJSON(), null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testCategoryPackages();