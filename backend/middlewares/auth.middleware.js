const jwt = require('jsonwebtoken');

const secret = 'PARALELEPIPEDO_FELIPE_NEDURO_SECRETO_JWT';

// Middleware que requiere autenticación
const requireAuth = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'Token requerido' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Formato de token inválido' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload; // { id, role }
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware que acepta token opcional: si existe lo decodifica, si no permite continuar
const optionalAuth = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return next();
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return next();
  const token = parts[1];
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
  } catch (err) {
    // ignore invalid token, continue as unauthenticated
  }
  return next();
};

module.exports = { requireAuth, optionalAuth };
