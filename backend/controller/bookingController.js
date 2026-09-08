const { Booking, BookingItem, Payment, User } = require('../models');
const { Op } = require('sequelize');

// ============================================
// POST /api/bookings - Create a booking
// ============================================
exports.createBooking = async (req, res) => {
  try {
    const {
      event_date,
      guest_count,
      special_requests,
      items
    } = req.body;

    // 1. Validate required fields
    if (!event_date || !guest_count || !items || !items.length) {
      return res.status(400).json({
        success: false,
        error: 'event_date, guest_count and items are required'
      });
    }

    // 2. Get customer_id from authenticated user
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // 3. Calculate total price
    let totalPrice = 0;
    const bookingItems = [];

    for (const item of items) {
      // In a real implementation, you'd fetch package and menu item prices from DB
      // For now, we'll use the provided unit_price
      const unitPrice = item.unit_price || 0;
      const quantity = item.quantity || 1;
      const subtotal = unitPrice * quantity;
      
      totalPrice += subtotal;
      
      bookingItems.push({
        package_id: item.package_id,
        menu_item_id: item.menu_item_id || null,
        quantity,
        unit_price: unitPrice,
        subtotal
      });
    }

    // 4. Create booking
    const booking = await Booking.create({
      customer_id: req.user.user_id,
      event_date,
      guest_count,
      total_price: totalPrice,
      status: 'pending',
      special_requests: special_requests || null
    });

    // 5. Create booking items
    const createdItems = await BookingItem.bulkCreate(
      bookingItems.map(item => ({
        ...item,
        booking_id: booking.booking_id
      }))
    );

    // 6. Create pending payment record
    const payment = await Payment.create({
      booking_id: booking.booking_id,
      amount: totalPrice,
      payment_method: 'payfast',
      payment_status: 'pending',
      itn_verified: false
    });

    // 7. Return complete booking
    res.status(201).json({
      success: true,
      data: {
        booking,
        items: createdItems,
        payment
      }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
};

// ============================================
// GET /api/bookings - Get user's bookings
// ============================================
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        customer_id: req.user.user_id
      },
      include: [
        {
          model: BookingItem,
          as: 'items'
        },
        {
          model: Payment,
          as: 'payment'
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
};

// ============================================
// GET /api/bookings/:id - Get single booking
// ============================================
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: BookingItem,
          as: 'items'
        },
        {
          model: Payment,
          as: 'payment'
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.customer_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
};

// ============================================
// PUT /api/bookings/:id/status - Update status
// ============================================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, confirmed, cancelled, completed'
      });
    }

    // Find booking
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check ownership
    if (booking.customer_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['cancelled', 'completed'],
      cancelled: [],
      completed: []
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot transition from ${booking.status} to ${status}`
      });
    }

    // Update booking
    await booking.update({ status });

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking'
    });
  }
};