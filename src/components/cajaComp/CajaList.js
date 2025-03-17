import React from 'react';
import CajaItem from './CajaItem';

const CajaList = ({ cajas }) => {
  return (
    <div>
      <h2>Lista de Cajas</h2>
      {cajas.map((caja, index) => (
        <CajaItem key={index} caja={caja} />
      ))}
    </div>
  );
};

export default CajaList;