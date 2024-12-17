
// En este archivo vamos a generar los tokens que serán únicos para cada usuario.

// Generando tokens.
const generandoId = () => {
    return new Date().getTime().toString(32) + Math.random().toString(32).substring(2);
};

// Generando y mostrando el ID.
const token = generandoId();
//console.log(token);

// Exportando. 
export  {
    generandoId, 

};