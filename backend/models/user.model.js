const db = require('../config/db'); // Importamos la conexión

const User = {};

User.findByEmail = async (email) => {
    try {
        // ¡Esta es la consulta clave!
        // 1. Unimos TUsuarios (u) con TRoles (r)
        // 2. Obtenemos el idUsuario, el password (para comparar) y el nombreRol
        // 3. Buscamos por email
        // 4. (Buena práctica) Añadimos "u.estadoA = 1" para que solo usuarios activos puedan loguearse
        const query = `
            SELECT 
                u.idUsuario, 
                u.password, 
                r.nombreRol
            FROM 
                TUsuarios u
            JOIN 
                TRoles r ON u.idRol = r.idRol
            WHERE 
                u.email = ? AND u.estadoA = 1
        `;

        const [rows] = await db.query(query, [email]);

        // Devuelve el primer usuario encontrado (o 'undefined')
        return rows[0];

    } catch (error) {
        console.error("Error al buscar usuario por email:", error);
        throw error; 
    }
};

module.exports = User;