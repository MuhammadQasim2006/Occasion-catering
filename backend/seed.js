require("dotenv").config();

const sequelize = require("./config/db");

const {
  Category,
  CateringPackage,
  MenuItem,
  TourOperator,
  TourPackage,
} = require("./models");

async function findOrCreateByField(
  Model,
  where,
  defaults
) {
  const [record, created] = await Model.findOrCreate({
    where,
    defaults,
  });

  return {
    record,
    created,
  };
}

async function seedDatabase() {
  try {
    await sequelize.authenticate();

    console.log("Database connection successful.");
    console.log("Starting seed...");

    /*
     * --------------------------------------------------
     * CATEGORIES
     * --------------------------------------------------
     */

    const categories = {};

    const categoryData = [
      {
        name: "Weddings",
      },
      {
        name: "Private Dinners",
      },
      {
        name: "Tours",
      },
    ];

    for (const data of categoryData) {
      const { record, created } =
        await findOrCreateByField(
          Category,
          {
            name: data.name,
          },
          data
        );

      categories[data.name] = record;

      console.log(
        `${created ? "Created" : "Found"} category: ${data.name}`
      );
    }

    /*
     * --------------------------------------------------
     * CATERING PACKAGES
     * --------------------------------------------------
     */

    const packageData = [
      {
        categoryName: "Weddings",
        name: "Royal Wedding Buffet",
        description:
          "Full 3-course luxury buffet with service staff.",
        base_price: 15000.0,
        event_size: "large",
        image_url:
          "https://example.com/images/wedding-buffet.jpg",
      },
      {
        categoryName: "Private Dinners",
        name: "Chef Table Experience",
        description:
          "Intimate 5-course plated dinner prepared on-site.",
        base_price: 4500.0,
        event_size: "small",
        image_url:
          "https://example.com/images/private-dinner.jpg",
      },
      {
        categoryName: "Private Dinners",
        name: "Garden Dinner Experience",
        description:
          "Elegant outdoor dinner setup with a curated menu.",
        base_price: 6000.0,
        event_size: "small",
        image_url:
          "https://example.com/images/garden-dinner.jpg",
      },
      {
        categoryName: "Weddings",
        name: "Luxury Wedding Plated Dinner",
        description:
          "Premium plated dinner service for larger celebrations.",
        base_price: 18500.0,
        event_size: "large",
        image_url:
          "https://example.com/images/wedding-plated.jpg",
      },
      {
        categoryName: "Tours",
        name: "Winelands Culinary Tour",
        description:
          "Curated Cape Winelands experience combining local food and sightseeing.",
        base_price: 2800.0,
        event_size: "tour",
        image_url:
          "https://example.com/images/winelands-tour.jpg",
      },
    ];

    const packages = {};

    for (const data of packageData) {
      const category =
        categories[data.categoryName];

      const { record, created } =
        await findOrCreateByField(
          CateringPackage,
          {
            category_id:
              category.category_id,
            name: data.name,
          },
          {
            category_id:
              category.category_id,
            name: data.name,
            description: data.description,
            base_price: data.base_price,
            event_size: data.event_size,
            image_url: data.image_url,
          }
        );

      packages[data.name] = record;

      console.log(
        `${created ? "Created" : "Found"} package: ${data.name}`
      );
    }

    /*
     * --------------------------------------------------
     * MENU ITEMS
     * --------------------------------------------------
     */

    const menuItemData = [
      {
        packageName:
          "Royal Wedding Buffet",
        name: "Prime Rib Roast",
        description:
          "Slow-roasted beef with rosemary jus.",
        price_addon: 0.0,
        is_default: true,
      },
      {
        packageName:
          "Royal Wedding Buffet",
        name: "Seafood Platter Addon",
        description:
          "Selection of fresh oysters, prawns, and calamari.",
        price_addon: 850.0,
        is_default: false,
      },
      {
        packageName:
          "Royal Wedding Buffet",
        name: "Truffle Mushroom Risotto",
        description:
          "Creamy Arborio rice with wild mushrooms and truffle oil.",
        price_addon: 0.0,
        is_default: true,
      },
      {
        packageName:
          "Chef Table Experience",
        name: "Truffle Mushroom Risotto",
        description:
          "Creamy Arborio rice with wild mushrooms and truffle oil.",
        price_addon: 0.0,
        is_default: true,
      },
      {
        packageName:
          "Chef Table Experience",
        name: "Grilled Linefish",
        description:
          "Locally sourced fish with seasonal vegetables and citrus butter.",
        price_addon: 450.0,
        is_default: false,
      },
      {
        packageName:
          "Chef Table Experience",
        name: "Beef Fillet",
        description:
          "Tender beef fillet with roasted vegetables and red wine jus.",
        price_addon: 650.0,
        is_default: false,
      },
      {
        packageName:
          "Garden Dinner Experience",
        name: "Herb-Crusted Chicken",
        description:
          "Roasted chicken breast with garden herbs and seasonal sides.",
        price_addon: 0.0,
        is_default: true,
      },
      {
        packageName:
          "Garden Dinner Experience",
        name: "Grilled Halloumi",
        description:
          "Grilled halloumi with roasted vegetables and herb dressing.",
        price_addon: 250.0,
        is_default: false,
      },
      {
        packageName:
          "Luxury Wedding Plated Dinner",
        name: "Beef Tenderloin",
        description:
          "Premium beef tenderloin served with a rich red wine jus.",
        price_addon: 0.0,
        is_default: true,
      },
      {
        packageName:
          "Luxury Wedding Plated Dinner",
        name: "Pan-Seared Salmon",
        description:
          "Atlantic salmon with lemon butter and seasonal vegetables.",
        price_addon: 500.0,
        is_default: false,
      },
      {
        packageName:
          "Winelands Culinary Tour",
        name: "Wine Pairing Upgrade",
        description:
          "Curated wine pairing with selected tasting stops.",
        price_addon: 650.0,
        is_default: false,
      },
      {
        packageName:
          "Winelands Culinary Tour",
        name: "Farm-to-Table Lunch",
        description:
          "Seasonal lunch featuring locally sourced ingredients.",
        price_addon: 0.0,
        is_default: true,
      },
    ];

    for (const data of menuItemData) {
      const cateringPackage =
        packages[data.packageName];

      const { created } =
        await findOrCreateByField(
          MenuItem,
          {
            package_id:
              cateringPackage.package_id,
            name: data.name,
          },
          {
            package_id:
              cateringPackage.package_id,
            name: data.name,
            description:
              data.description,
            price_addon:
              data.price_addon,
            is_default:
              data.is_default,
          }
        );

      console.log(
        `${created ? "Created" : "Found"} menu item: ${data.name} (${data.packageName})`
      );
    }

    /*
     * --------------------------------------------------
     * TOUR OPERATORS
     * --------------------------------------------------
     */

    const tourOperatorData = [
      {
        company_name:
          "Cape Explorer Tours",
        contact_email:
          "info@capeexplorer.test",
        contact_phone:
          "+27210000001",
      },
      {
        company_name:
          "Winelands Adventure Co",
        contact_email:
          "info@winelandsadventure.test",
        contact_phone:
          "+27210000002",
      },
      {
        company_name:
          "Table Mountain Experiences",
        contact_email:
          "info@tablemountainexperiences.test",
        contact_phone:
          "+27210000003",
      },
    ];

    const operators = {};

    for (const data of tourOperatorData) {
      const { record, created } =
        await findOrCreateByField(
          TourOperator,
          {
            company_name:
              data.company_name,
          },
          data
        );

      operators[data.company_name] =
        record;

      console.log(
        `${created ? "Created" : "Found"} tour operator: ${data.company_name}`
      );
    }

    /*
     * --------------------------------------------------
     * TOUR PACKAGES
     * --------------------------------------------------
     */

    const tourPackageData = [
      {
        operatorName:
          "Cape Explorer Tours",
        packageName:
          "Winelands Culinary Tour",
        itinerary_notes:
          "Full-day Cape Winelands experience with wine tasting, scenic stops, and a farm-to-table lunch.",
      },
      {
        operatorName:
          "Winelands Adventure Co",
        packageName:
          "Winelands Culinary Tour",
        itinerary_notes:
          "Premium Stellenbosch and Franschhoek route with guided tastings and curated local cuisine.",
      },
      {
        operatorName:
          "Table Mountain Experiences",
        packageName:
          "Winelands Culinary Tour",
        itinerary_notes:
          "Combination of Cape Town sightseeing, mountain views, and an afternoon culinary experience.",
      },
    ];

    for (const data of tourPackageData) {
      const operator =
        operators[data.operatorName];

      const cateringPackage =
        packages[data.packageName];

      const { created } =
        await findOrCreateByField(
          TourPackage,
          {
            operator_id:
              operator.operator_id,
            package_id:
              cateringPackage.package_id,
          },
          {
            operator_id:
              operator.operator_id,
            package_id:
              cateringPackage.package_id,
            itinerary_notes:
              data.itinerary_notes,
          }
        );

      console.log(
        `${created ? "Created" : "Found"} tour package for ${data.operatorName}`
      );
    }

    console.log("Seed completed successfully.");
  } catch (error) {
    console.error("Seed failed.");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedDatabase();