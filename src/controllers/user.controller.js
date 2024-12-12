// Creando controladores

// Controlador para el renderizado de la pagina de inicio.
const inicio = ( req, res ) => {
    res.render('layout/index', {
        autenticado: false
      });
};

// Controlador para el renderizado de la pagina del login
const formLogin = ( req, res ) => {
    res.render('auth/login', {
        paginaLogin: "Iniciar sesion"
      });
};

// Controlador para el renderizado de la pagina del registro. 
const formRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
    });
};

const recuperarCuenta = (req, res) => {
    res.render('auth/recuperarCuenta', {
        paginaRecuperarCuenta: 'Recuperar mi cuenta',
    });
};

const registrar = ( req, res ) => {
    const [ nombre, email, password, repetirPassword ] = req.body;
    if (password !== repetirPassword) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            error: 'Las contraseñas no coinciden',
        });
    }
    res.redirect('/login'); 
};

export {
    inicio,
    formLogin,
    formRegistro,
    recuperarCuenta,
    registrar
};