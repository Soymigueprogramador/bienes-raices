// Controlador para la vista de administrador de propiedades
const administradorPropiedades = (req, res) => {
    res.render('propiedades/administradorPropiedades', {
      pagina: 'Bienvenido a la vista del administrador de las propiedades',
    });
  };
  
  // Controlador para la vista de creación de propiedades
  const crear = (req, res) => {
    res.render('propiedades/crear', {
      pagina: 'Crear propiedad',
      aviso: 'Formulario para la carga de una propiedad',
    });
  };
  
  // Exportación de las funciones
  export { administradorPropiedades, crear };  