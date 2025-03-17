import React from 'react';

const CajaActions = ({ onEdit, onDelete }) => {
  return (
    <div>
      <button onClick={onEdit}>Editar</button>
      <button onClick={onDelete}>Eliminar</button>
    </div>
  );
};

export default CajaActions;