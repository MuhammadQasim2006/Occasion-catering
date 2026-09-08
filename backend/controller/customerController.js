const { Customer, User } = require('../models');

// GET /api/customers/:id
exports.getCustomerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const customer = await Customer.findOne({
      where: { user_id: id },
      include: [
        {
          model: User,
          attributes: ['email', 'role']
        }
      ]
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer profile'
    });
  }
};

// PUT /api/customers/:id
exports.updateCustomerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone } = req.body;

    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const customer = await Customer.findOne({
      where: { user_id: id }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    if (first_name) customer.first_name = first_name;
    if (last_name) customer.last_name = last_name;
    if (phone) customer.phone = phone;

    await customer.save();

    res.json({
      success: true,
      data: customer,
      message: 'Customer profile updated'
    });
  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer profile'
    });
  }
};