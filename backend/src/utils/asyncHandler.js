// Wraps an async Express handler so errors are passed to next() (errorHandler)
const asyncHandler = (fn) => (req, res, next) => {
  // Run the controller; rejected promises skip Express and go to error middleware
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
