import React, { useState } from 'react';
import {
  CContainer,
  CHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CCol,
} from '@coreui/react';

const CajaForm = ({ onAddCaja }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaCaja = {}; // Aquí puedes agregar los datos necesarios
    onAddCaja(nuevaCaja); // Envía la nueva caja al componente principal
  };

  // Títulos del header
  const titulosHeader = [
    'Nombre Caja',
    'Fecha Apertura',
    'Fecha Clausura',
    'Saldo Inicial',
    'Entradas',
    'Salidas',
    'Saldo Final',
    'Estado',
    'Usuario',
  ];

  return (
    <CContainer>
      {/* Header con los títulos y bordes redondeados */}
      <CHeader position="sticky" className="mb-4 rounded">
        <CRow>
          {titulosHeader.map((titulo, index) => (
            <CCol key={index} className="text-center fw-bold">
              {titulo}
            </CCol>
          ))}
        </CRow>
      </CHeader>

      {/* Formulario para crear una nueva caja */}
      <CForm onSubmit={handleSubmit}>
        <CRow className="mb-3">
          {/* Aquí puedes agregar los campos necesarios en el futuro */}
        </CRow>
        <CButton type="submit" color="primary">
          Crear Caja
        </CButton>
      </CForm>
    </CContainer>
  );
};

export default CajaForm;