const { CateringPackage, Category, MenuItem, Booking, Customer, BookingItem, Payment } = require('../models');

// POST /api/packages (Admin only)
exports.createPackage = async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      base_price,
      event_size,
      image_url,
      menu_items
    } = req.body;

    if (!category_id || !name || !base_price || !event_size) {
      return res.status(400).json({
        success: false,
        message: 'Category ID, name, base price, and event size are required'
      });
    }

    const pkg = await CateringPackage.create({
      category_id,
      name,
      description,
      base_price,
      event_size,
      image_url
    });

    if (menu_items && Array.isArray(menu_items)) {
      const menuItems = menu_items.map(item => ({
        package_id: pkg.package_id,
        name: item.name,
        description: item.description,
        price_addon: item.price_addon || 0,
        is_default: item.is_default || false
      }));
      await MenuItem.bulkCreate(menuItems);
    }

    const createdPackage = await CateringPackage.findByPk(pkg.package_id, {
      include: [
        {
          model: Category,
          attributes: ['category_id', 'name']
        },
        {
          model: MenuItem,
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdPackage,
      message: 'Package created successfully'
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create package'
    });
  }
};

// PUT /api/packages/:id (Admin only)
exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, base_price, image_url } = req.body;

    const pkg = await CateringPackage.findByPk(id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    if (name) pkg.name = name;
    if (description !== undefined) pkg.description = description;
    if (base_price) pkg.base_price = base_price;
    if (image_url !== undefined) pkg.image_url = image_url;

    await pkg.save();

    const updatedPackage = await CateringPackage.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['category_id', 'name']
        },
        {
          model: MenuItem,
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: updatedPackage,
      message: 'Package updated successfully'
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update package'
    });
  }
};

// DELETE /api/packages/:id (Admin only)
exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await CateringPackage.findByPk(id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    await pkg.destroy();

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete package'
    });
  }
};

// GET /api/admin/bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [
        ['created_at', 'DESC'],
        ['booking_id', 'DESC']
      ],
      include: [
        { model: Customer },
        {
          model: BookingItem,
          include: [{ model: CateringPackage }, { model: MenuItem }]
        },
        { model: Payment }
      ]
    });

    return res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings'
    });
  }
};

// PATCH /api/admin/bookings/:id/status (Admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID must be a positive integer'
      });
    }

    const allowedStatuses = ['pending', 'confirmed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status must be one of: pending, confirmed, cancelled'
      });
    }

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.update({ status });

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
};