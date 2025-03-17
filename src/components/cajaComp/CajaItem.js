import React from 'react';

const CajaItem = ({ caja }) => {
  return (
    <div>
      <p>Dimensiones: Largo - {caja.dimensiones.largo}, Ancho - {caja.dimensiones.ancho}, Alto - {caja.dimensiones.alto}</p>
      <p>Peso: {caja.peso}</p>
    </div>
  );
};

export default CajaItem;