const { CateringPackage, Category, MenuItem } = require('../models');
const { Op } = require('sequelize');

// GET /api/packages
exports.getPackages = async (req, res) => {
  try {
    const { category_id, search, event_size } = req.query;

    const where = {};

    if (category_id) {
      where.category_id = parseInt(category_id);
    }

    if (event_size) {
      where.event_size = event_size;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const packages = await CateringPackage.findAll({
      where,
      include: [
        {
          model: Category,
          attributes: ['category_id', 'name']
        },
        {
          model: MenuItem,
          required: false,
          attributes: ['menu_item_id', 'name', 'description', 'price_addon', 'is_default']
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages'
    });
  }
};

// GET /api/packages/:id
exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await CateringPackage.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['category_id', 'name']
        },
        {
          model: MenuItem,
          required: false,
          attributes: ['menu_item_id', 'name', 'description', 'price_addon', 'is_default']
        }
      ]
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      data: pkg
    });
  } catch (error) {
    console.error('Get package by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package'
    });
  }
};

// GET /api/packages/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: CateringPackage,
          attributes: ['package_id'],
          required: false
        }
      ]
    });

    const result = categories.map(category => ({
      category_id: category.category_id,
      name: category.name,
      package_count: category.CateringPackages?.length || 0
    }));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};