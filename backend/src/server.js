require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

async function connectWithRetry() {
  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB connection failed (will retry):', err.message || err);
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();
