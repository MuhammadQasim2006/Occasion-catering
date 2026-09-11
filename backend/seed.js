// Seeds the database with the SAME data the frontend's mock layer
// (occasion-frontend/src/data/mockPackages.js) has been showing all along —
// same categories, same 8 packages (name, price, description, image_url,
// event_size), same presentation fields (guests/courses/feature/badge/
// featured), and the same per-package starter/main/dessert menus with
// dietary tags. Once the frontend swaps mockPackages.js calls for real
// Axios calls, this is what it'll see instead — no visible change.
require("dotenv").config();

const sequelize = require("./config/db");

const {
  Category,
  CateringPackage,
  MenuItem,
  TourOperator,
  TourPackage,
} = require("./models");

async function findOrCreateByField(Model, where, defaults) {
  const [record, created] = await Model.findOrCreate({ where, defaults });
  return { record, created };
}

async function seedDatabase() {
  try {
    await sequelize.authenticate();

    console.log("Database connection successful.");
    console.log("Starting seed...");

    /*
     * --------------------------------------------------
     * CATEGORIES (matches mockPackages.js `categories`)
     * --------------------------------------------------
     */

    const categories = {};

    const categoryData = [
      { name: "Weddings" },
      { name: "Corporate" },
      { name: "Private Dinners" },
      { name: "Tours" },
    ];

    for (const data of categoryData) {
      const { record, created } = await findOrCreateByField(
        Category,
        { name: data.name },
        data
      );
      categories[data.name] = record;
      console.log(`${created ? "Created" : "Found"} category: ${data.name}`);
    }

    /*
     * --------------------------------------------------
     * CATERING PACKAGES (matches mockPackages.js `packages`,
     * including the UI-only guests/courses/feature/badge/featured fields)
     * --------------------------------------------------
     */

    const packageData = [
      {
        categoryName: "Weddings",
        name: "Executive Wedding",
        description:
          "Full-service plated dining with a dedicated coordinator on the day.",
        base_price: 200.0,
        event_size: "large",
        image_url:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
        guests_label: "50+ Guests",
        courses_label: "3 Courses",
        feature_label: "Setup Included",
        badge: "Popular",
        is_featured: true,
      },
      {
        categoryName: "Corporate",
        name: "Corporate Brunch",
        description:
          "Buffet-style brunch spread built for meetings, launches, and offsites.",
        base_price: 150.0,
        event_size: "small",
        image_url:
          "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
        guests_label: "30+ Guests",
        courses_label: "2 Courses",
        feature_label: "Setup Included",
        badge: null,
        is_featured: false,
      },
      {
        categoryName: "Private Dinners",
        name: "Signature Private",
        description:
          "An intimate, chef-led tasting menu served in your own space.",
        base_price: 300.0,
        event_size: "small",
        image_url:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
        guests_label: "80+ Guests",
        courses_label: "3 Courses",
        feature_label: "Premium Service",
        badge: "New",
        is_featured: true,
      },
      {
        categoryName: "Tours",
        name: "Winelands Harvest",
        description:
          "Farm-style sharing platters, delivered en route for tour groups.",
        base_price: 250.0,
        event_size: "tour",
        image_url:
          "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80",
        guests_label: "40+ Guests",
        courses_label: "2 Courses",
        feature_label: "Delivery Included",
        badge: null,
        is_featured: true,
      },
      {
        categoryName: "Weddings",
        name: "Garden Celebration",
        description:
          "Relaxed outdoor-friendly menu with vegetarian and vegan options built in.",
        base_price: 180.0,
        event_size: "large",
        image_url:
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
        guests_label: "60+ Guests",
        courses_label: "3 Courses",
        feature_label: "Setup Included",
        badge: null,
        is_featured: false,
      },
      {
        categoryName: "Corporate",
        name: "Boardroom Lunch",
        description:
          "Individually boxed lunches with allergen labelling for larger teams.",
        base_price: 120.0,
        event_size: "small",
        image_url:
          "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80",
        guests_label: "10+ Guests",
        courses_label: "1 Course",
        feature_label: "Delivery Included",
        badge: null,
        is_featured: true,
      },
      {
        categoryName: "Private Dinners",
        name: "Candlelit Anniversary",
        description:
          "A five-course set menu for two, plated course by course at home.",
        base_price: 450.0,
        event_size: "small",
        image_url:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
        guests_label: "2+ Guests",
        courses_label: "5 Courses",
        feature_label: "Premium Service",
        badge: null,
        is_featured: false,
      },
      {
        categoryName: "Tours",
        name: "Safari Sundowner",
        description:
          "Canapés and drinks service timed to golden hour game drives.",
        base_price: 220.0,
        event_size: "tour",
        image_url:
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80",
        guests_label: "20+ Guests",
        courses_label: "2 Courses",
        feature_label: "Delivery Included",
        badge: "New",
        is_featured: false,
      },
    ];

    const packages = {};

    for (const data of packageData) {
      const category = categories[data.categoryName];

      const { record, created } = await findOrCreateByField(
        CateringPackage,
        { category_id: category.category_id, name: data.name },
        {
          category_id: category.category_id,
          name: data.name,
          description: data.description,
          base_price: data.base_price,
          event_size: data.event_size,
          image_url: data.image_url,
          guests_label: data.guests_label,
          courses_label: data.courses_label,
          feature_label: data.feature_label,
          badge: data.badge,
          is_featured: data.is_featured,
        }
      );

      packages[data.name] = record;
      console.log(`${created ? "Created" : "Found"} package: ${data.name}`);
    }

    /*
     * --------------------------------------------------
     * MENU ITEMS (matches mockPackages.js `menuItemsByPackage`,
     * keyed the same way: package name -> starters/mains/desserts,
     * each carrying its dietary tags)
     * --------------------------------------------------
     */

    const menuItemsByPackage = {
      "Executive Wedding": {
        starters: [
          { name: "Butternut & Sage Soup", dietary: ["veg", "halal"] },
          { name: "Biltong & Fig Salad", dietary: ["halal"] },
          { name: "Roasted Beet Carpaccio", dietary: ["veg", "gf", "halal"] },
        ],
        mains: [
          { name: "Slow-Roasted Lamb Shoulder", dietary: ["gf", "halal"] },
          { name: "Pan-Seared Kingklip", dietary: ["gf", "halal"] },
          { name: "Wild Mushroom Risotto", dietary: ["veg", "halal"] },
          { name: "Free-Range Chicken Ballotine", dietary: ["halal"] },
        ],
        desserts: [
          { name: "Malva Pudding & Custard", dietary: ["veg", "halal"] },
          { name: "Dark Chocolate Torte", dietary: ["veg", "gf", "halal"] },
          {
            name: "Vanilla Bean Wedding Cake Slice",
            dietary: ["veg", "halal"],
          },
        ],
      },
      "Corporate Brunch": {
        starters: [
          {
            name: "Fresh Fruit & Granola Cups",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
          {
            name: "Mini Croissants & Danish Pastries",
            dietary: ["veg", "halal"],
          },
          { name: "Smoked Salmon Bagel Bites", dietary: ["halal"] },
        ],
        mains: [
          { name: "Baked Eggs Florentine", dietary: ["veg", "halal"] },
          { name: "Beef Rasher & Cheese Frittata", dietary: ["gf", "halal"] },
          { name: "Avocado & Halloumi Toast", dietary: ["veg", "halal"] },
          { name: "Chicken & Waffle Sliders", dietary: ["halal"] },
        ],
        desserts: [
          { name: "Lemon Yoghurt Muffins", dietary: ["veg", "halal"] },
          {
            name: "Seasonal Fruit Platter",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
          { name: "Mini Cinnamon Rolls", dietary: ["veg", "halal"] },
        ],
      },
      "Signature Private": {
        starters: [
          {
            name: "Seared Queen Prawns with Pea Purée",
            dietary: ["gf", "halal"],
          },
          { name: "Beef Carpaccio, Truffle & Quail Egg", dietary: ["halal"] },
          { name: "Heirloom Tomato & Burrata", dietary: ["veg", "halal"] },
        ],
        mains: [
          { name: "Dry-Aged Sirloin, Rosemary Jus", dietary: ["gf", "halal"] },
          { name: "Miso-Glazed Black Cod", dietary: ["gf", "halal"] },
          {
            name: "Truffle & Parmesan Tortellini",
            dietary: ["veg", "halal"],
          },
        ],
        desserts: [
          { name: "Deconstructed Tiramisu", dietary: ["veg", "halal"] },
          { name: "Valrhona Chocolate Fondant", dietary: ["veg", "halal"] },
          {
            name: "Passionfruit & Yuzu Sorbet",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
        ],
      },
      "Winelands Harvest": {
        starters: [
          {
            name: "Farm Bread & Cultured Butter Board",
            dietary: ["veg", "halal"],
          },
          {
            name: "Cured Meats & Preserves Platter",
            dietary: ["gf", "halal"],
          },
          {
            name: "Marinated Olives & Farm Cheeses",
            dietary: ["veg", "gf", "halal"],
          },
        ],
        mains: [
          { name: "Wood-Fired Boerewors & Chutney", dietary: ["gf", "halal"] },
          { name: "Harvest Vegetable Tart", dietary: ["veg", "halal"] },
          {
            name: "Grilled Chicken & Peri Peri Basting",
            dietary: ["gf", "halal"],
          },
        ],
        desserts: [
          {
            name: "Rustic Apple & Cinnamon Crumble",
            dietary: ["veg", "halal"],
          },
          { name: "Farm Honey & Ricotta Tart", dietary: ["veg", "halal"] },
          {
            name: "Seasonal Vineyard Fruit Bowl",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
        ],
      },
      "Garden Celebration": {
        starters: [
          {
            name: "Heirloom Tomato Gazpacho",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
          {
            name: "Grilled Peach & Burrata Salad",
            dietary: ["veg", "gf", "halal"],
          },
          {
            name: "Chargrilled Asparagus & Lemon Oil",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
        ],
        mains: [
          {
            name: "Herb-Crusted Vegetable Wellington",
            dietary: ["veg", "vegan", "halal"],
          },
          { name: "Lemon & Thyme Roast Chicken", dietary: ["gf", "halal"] },
          {
            name: "Grilled Line Fish, Salsa Verde",
            dietary: ["gf", "halal"],
          },
          {
            name: "Chickpea & Butternut Tagine",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
        ],
        desserts: [
          { name: "Lavender Panna Cotta", dietary: ["veg", "gf", "halal"] },
          {
            name: "Vegan Berry Pavlova",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
          { name: "Garden Herb Lemon Tart", dietary: ["veg", "halal"] },
        ],
      },
      "Boardroom Lunch": {
        starters: [
          {
            name: "Garden Side Salad, Boxed",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
          { name: "Butternut Soup Cup", dietary: ["veg", "gf", "halal"] },
          {
            name: "Hummus & Crudité Box",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
        ],
        mains: [
          { name: "Chicken Mayo Sandwich Box", dietary: ["halal"] },
          {
            name: "Falafel & Tahini Wrap",
            dietary: ["veg", "vegan", "halal"],
          },
          { name: "Grilled Steak Sandwich Box", dietary: ["halal"] },
          {
            name: "Quinoa & Roast Veg Bowl",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
        ],
        desserts: [
          { name: "Boxed Brownie Bite", dietary: ["veg", "halal"] },
          {
            name: "Fresh Fruit Cup",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
          { name: "Oat & Berry Slice", dietary: ["veg", "vegan", "halal"] },
        ],
      },
      "Candlelit Anniversary": {
        starters: [
          {
            name: "Charred Prawn Ceviche, Citrus Mignonette",
            dietary: ["gf", "halal"],
          },
          {
            name: "Wild Mushroom & Truffle Velouté",
            dietary: ["veg", "gf", "halal"],
          },
          {
            name: "Beetroot-Cured Salmon Gravlax",
            dietary: ["gf", "halal"],
          },
        ],
        mains: [
          {
            name: "Rack of Lamb, Rosemary & Red Grape Jus",
            dietary: ["gf", "halal"],
          },
          { name: "Butter-Poached Lobster Tail", dietary: ["gf", "halal"] },
          {
            name: "Wild Mushroom & Truffle Risotto",
            dietary: ["veg", "gf", "halal"],
          },
        ],
        desserts: [
          {
            name: "Molten Chocolate Soufflé for Two",
            dietary: ["veg", "halal"],
          },
          {
            name: "Rose & Raspberry Jelly",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
          {
            name: "Vanilla Bean Crème Brûlée",
            dietary: ["veg", "gf", "halal"],
          },
        ],
      },
      "Safari Sundowner": {
        starters: [
          { name: "Biltong & Cream Cheese Canapés", dietary: ["halal"] },
          {
            name: "Smoked Springbok Carpaccio Bites",
            dietary: ["gf", "halal"],
          },
          {
            name: "Roasted Butternut & Feta Skewers",
            dietary: ["veg", "gf", "halal"],
          },
        ],
        mains: [
          { name: "Mini Boerewors Rolls", dietary: ["halal"] },
          { name: "Peri Peri Chicken Skewers", dietary: ["gf", "halal"] },
          {
            name: "Grilled Halloumi & Vegetable Skewers",
            dietary: ["veg", "gf", "halal"],
          },
        ],
        desserts: [
          {
            name: "Salted Caramel Chocolate Mousse Shots",
            dietary: ["veg", "halal"],
          },
          {
            name: "Rooibos-Poached Fruit Skewers",
            dietary: ["veg", "vegan", "gf", "halal"],
          },
          { name: "Malva Pudding Bites", dietary: ["veg", "halal"] },
        ],
      },
    };

    const courseTypes = {
      starters: "starter",
      mains: "main",
      desserts: "dessert",
    };

    for (const [packageName, courses] of Object.entries(menuItemsByPackage)) {
      const cateringPackage = packages[packageName];

      for (const [courseKey, items] of Object.entries(courses)) {
        const course_type = courseTypes[courseKey];

        for (const item of items) {
          const { created } = await findOrCreateByField(
            MenuItem,
            { package_id: cateringPackage.package_id, name: item.name },
            {
              package_id: cateringPackage.package_id,
              name: item.name,
              description: null,
              course_type,
              dietary_tags: item.dietary,
              price_addon: 0.0,
              is_default: true,
            }
          );

          console.log(
            `${created ? "Created" : "Found"} menu item: ${item.name} (${packageName})`
          );
        }
      }
    }

    /*
     * --------------------------------------------------
     * TOUR OPERATORS
     * --------------------------------------------------
     */

    const tourOperatorData = [
      {
        company_name: "Cape Explorer Tours",
        contact_email: "info@capeexplorer.test",
        contact_phone: "+27210000001",
      },
      {
        company_name: "Winelands Adventure Co",
        contact_email: "info@winelandsadventure.test",
        contact_phone: "+27210000002",
      },
      {
        company_name: "Table Mountain Experiences",
        contact_email: "info@tablemountainexperiences.test",
        contact_phone: "+27210000003",
      },
    ];

    const operators = {};

    for (const data of tourOperatorData) {
      const { record, created } = await findOrCreateByField(
        TourOperator,
        { company_name: data.company_name },
        data
      );
      operators[data.company_name] = record;
      console.log(
        `${created ? "Created" : "Found"} tour operator: ${data.company_name}`
      );
    }

    /*
     * --------------------------------------------------
     * TOUR PACKAGES — links operators to the two Tours-category
     * packages from mockPackages.js (Winelands Harvest, Safari Sundowner)
     * --------------------------------------------------
     */

    const tourPackageData = [
      {
        operatorName: "Cape Explorer Tours",
        packageName: "Winelands Harvest",
        itinerary_notes:
          "Full-day Cape Winelands experience with wine tasting, scenic stops, and farm-style sharing platters en route.",
      },
      {
        operatorName: "Winelands Adventure Co",
        packageName: "Winelands Harvest",
        itinerary_notes:
          "Premium Stellenbosch and Franschhoek route with guided tastings and curated local cuisine.",
      },
      {
        operatorName: "Table Mountain Experiences",
        packageName: "Safari Sundowner",
        itinerary_notes:
          "Golden-hour game drive combined with canapés and drinks service at sundown.",
      },
    ];

    for (const data of tourPackageData) {
      const operator = operators[data.operatorName];
      const cateringPackage = packages[data.packageName];

      const { created } = await findOrCreateByField(
        TourPackage,
        {
          operator_id: operator.operator_id,
          package_id: cateringPackage.package_id,
        },
        {
          operator_id: operator.operator_id,
          package_id: cateringPackage.package_id,
          itinerary_notes: data.itinerary_notes,
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
