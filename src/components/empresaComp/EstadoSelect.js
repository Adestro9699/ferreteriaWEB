import React from 'react';

const EstadoSelect = ({ value, onChange, disabled }) => {
  return (
    <select
      className="form-select"
      name="estado"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="ACTIVO">Activo</option>
      <option value="INACTIVO">Inactivo</option>
    </select>
  );
};

export default EstadoSelect;