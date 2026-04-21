module.exports = (err, req, res, _next) => {
  console.error(err);

  // Mongo/Mongoose "database down" / connectivity errors → 503
  const mongoConnectivity =
    err?.name === 'MongoNetworkError' ||
    err?.name === 'MongooseServerSelectionError' ||
    err?.name === 'MongoServerSelectionError' ||
    (typeof err?.message === 'string' &&
      /(ECONNREFUSED|ENOTFOUND|ETIMEDOUT|server selection timed out|Topology is closed)/i.test(err.message));

  const status = mongoConnectivity ? 503 : (err.status || 500);
  res.status(status).json({
    message:
      status === 503
        ? 'Service unavailable: database disconnected. Please try again shortly.'
        : (err.message || 'Internal server error'),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
