module.exports = function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) return res.status(401).json({ message: 'Autenticación requerida' });
    const role = req.user.role;
    if (allowedRoles.includes(role)) return next();
    return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso' });
  };
};
