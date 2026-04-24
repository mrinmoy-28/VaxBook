const mongoose = require('mongoose');

function maskMongoUri(uri) {
  try {
    const u = new URL(uri);
    if (u.username || u.password) {
      u.username = u.username ? '***' : '';
      u.password = u.password ? '***' : '';
    }
    return u.toString();
  } catch {
    return '<invalid MONGO_URI>';
  }
}

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set in .env');

  const tlsInsecure =
    String(process.env.MONGO_TLS_INSECURE || '').toLowerCase() === 'true';

  console.log(`MongoDB connecting: ${maskMongoUri(uri)}`);
  console.log(`MongoDB tls insecure: ${tlsInsecure}`);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    ...(tlsInsecure
      ? {
          tls: true,
          tlsAllowInvalidCertificates: true,
          tlsAllowInvalidHostnames: true,
        }
      : {}),
  });
  console.log('MongoDB connected');
}

module.exports = connectDB;
 