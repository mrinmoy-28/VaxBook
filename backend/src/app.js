const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth.routes');
const hospitalRoutes = require('./routes/hospital.routes');
const vaccineRoutes = require('./routes/vaccine.routes');
const slotRoutes = require('./routes/slot.routes');
const bookingRoutes = require('./routes/booking.routes');
const adminRoutes = require('./routes/admin.routes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

const corsOrigin = process.env.NODE_ENV === 'development'
  ? (origin, cb) => cb(null, true)
  : process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  const readyState = mongoose.connection?.readyState ?? 0;
  const db =
    readyState === 1 ? 'connected'
      : readyState === 2 ? 'connecting'
      : readyState === 3 ? 'disconnecting'
      : 'disconnected';

  res.status(db === 'connected' ? 200 : 503).json({
    status: 'ok',
    service: 'vaccine-booking-api',
    db,
  });
});

// If the DB is down, fail fast instead of hanging on Mongoose timeouts.
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if ((mongoose.connection?.readyState ?? 0) === 1) return next();
  return res.status(503).json({
    message: 'Service unavailable: Please try again shortly.',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

module.exports = app;
