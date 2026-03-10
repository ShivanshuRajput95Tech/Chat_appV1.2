const errorMiddleware = (err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const errorId = Math.random().toString(36).substr(2, 9);
    
    console.error(`[${timestamp}] Error ID: ${errorId}`, {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        userId: req.user?._id
    });
    
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    // Don't expose sensitive error details in production
    const response = {
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
        ...(process.env.NODE_ENV === 'development' && { errorId, stack: err.stack })
    };
    
    res.status(status).json(response);
};

module.exports = errorMiddleware;