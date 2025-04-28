const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  };
  
  const isOwnerOrAdmin = async (req, res, next) => {
    if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Not authorized to access this resource.' });
  };
  
  module.exports = { isAdmin, isOwnerOrAdmin };