// Creando controladores

// Controlador para el renderizado de la pagina de inicio.
const inicio = ( req, res ) => {
    res.render('auth/index', {
        autenticado: false
      });
};

// Controlador para el renderizado de la pagina del login
const formLogin = ( req, res ) => {
    res.render('auth/login', {
        hola: true
      });
};

// Controlador para el renderizado de la pagina del registro. 
const formregistro = ( req, res ) => {
    res.render('auth/registro', {
        Holastamos: true
      });
};

export {
    inicio,
    formLogin,
    formregistro
};