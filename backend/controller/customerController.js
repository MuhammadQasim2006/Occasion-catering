const { Customer, User } = require('../models');

// GET /api/customers/:id
exports.getCustomerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Convert both IDs to numbers before comparing
    const userId = Number(req.user.user_id);
    const customerId = Number(id);

    // Only admins or the customer themselves can access the profile
    if (req.user.role !== 'admin' && userId !== customerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const customer = await Customer.findOne({
      where: {
        user_id: customerId
      },
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

    return res.status(200).json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Get customer profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer profile',
      error: error.message
    });
  }
};


// PUT /api/customers/:id
exports.updateCustomerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone } = req.body;

    // Convert both IDs to numbers
    const userId = Number(req.user.user_id);
    const customerId = Number(id);

    // Only admins or the customer themselves can update the profile
    if (req.user.role !== 'admin' && userId !== customerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const customer = await Customer.findOne({
      where: {
        user_id: customerId
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update fields only when they were provided
    if (first_name !== undefined) {
      customer.first_name = first_name;
    }

    if (last_name !== undefined) {
      customer.last_name = last_name;
    }

    if (phone !== undefined) {
      customer.phone = phone;
    }

    await customer.save();

    return res.status(200).json({
      success: true,
      data: customer,
      message: 'Customer profile updated'
    });

  } catch (error) {
    console.error('Update customer profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update customer profile',
      error: error.message
    });
  }
};