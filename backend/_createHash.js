//LUEGO HACER ESTO EN UN FORMULARIO DE REGISTRO

const bcrypt = require('bcryptjs');

// La contraseña que quieres usar
<<<<<<< Updated upstream
const passwordPlana = 'admin123';
=======
const passwordPlana = 'password123';
>>>>>>> Stashed changes

// El '10' es el "costo" de encriptación. 10 es un buen estándar.
const hash = bcrypt.hashSync(passwordPlana, 10);

console.log('Tu contraseña plana:', passwordPlana);
console.log('Pégalo en tu base de datos (columna password):');
console.log(hash);