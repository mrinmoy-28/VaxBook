const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

exports.bookingsByDay = async (req, res, next) => {
  try {
    const { date, hospitalId } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (hospitalId) filter.hospitalId = hospitalId;
    const bookings = await Booking.find(filter)
      .populate('hospitalId', 'name')
      .populate('vaccineId', 'name')
      .populate('userId', 'name email phone');
    res.json({ bookings });
  } catch (err) { next(err); }
};

exports.stats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [totalBookings, confirmedToday, slots, hospitals] = await Promise.all([
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'confirmed', date: today }),
      Slot.find().select('totalCapacity bookedCount'),
      require('../models/Hospital').countDocuments(),
    ]);
    
    const availableSlots = slots.reduce((sum, s) => {
      const available = (s.totalCapacity || 0) - (s.bookedCount || 0);
      return sum + Math.max(0, available);
    }, 0);
    
    res.json({ totalBookings, confirmedToday, availableSlots, activeHospitals: hospitals });
  } catch (err) { next(err); }
};
