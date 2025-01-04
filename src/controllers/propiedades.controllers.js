// Aca van los controladores de las propiedades.

// Importaciones necesarias.


// Controlador de propiedades.
const administradorPropiedades = ( req, res ) => {
    res.render('propiedades/administradorPropiedades', {
        pagina: 'Bienvenido a la vista del administrador de las propiedades',
    });
};


// Exportaciones de las funciones.
export {
    administradorPropiedades
};