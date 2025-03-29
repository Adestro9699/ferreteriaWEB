import React from 'react';
import { 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell, 
  CBadge,
  CButton,
  CSpinner
} from '@coreui/react';

const GlobalTable = ({ data, onEdit, onDelete, loading }) => {
  const formatClave = (clave) => {
    const claves = {
      IGV: 'IGV',
      UTILIDAD_GLOBAL: 'Utilidad Global'
    };
    return claves[clave] || clave;
  };

  const handleDelete = (clave) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el parámetro ${formatClave(clave)}?`)) {
      onDelete(clave);
    }
  };

  return (
    <CTable striped hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Parámetro</CTableHeaderCell>
          <CTableHeaderCell>Valor</CTableHeaderCell>
          <CTableHeaderCell>Descripción</CTableHeaderCell>
          <CTableHeaderCell>Observaciones</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {loading ? (
          <CTableRow>
            <CTableDataCell colSpan="5" className="text-center">
              <CSpinner color="primary" />
            </CTableDataCell>
          </CTableRow>
        ) : data.length === 0 ? (
          <CTableRow>
            <CTableDataCell colSpan="5" className="text-center">
              No hay parámetros configurados
            </CTableDataCell>
          </CTableRow>
        ) : (
          data.map((parametro) => (
            <CTableRow key={`param-${parametro.clave}`}>
              <CTableDataCell>
                <CBadge color={parametro.clave === 'IGV' ? 'info' : 'warning'}>
                  {formatClave(parametro.clave)}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>{parametro.valor}</CTableDataCell>
              <CTableDataCell>{parametro.descripcion || '-'}</CTableDataCell>
              <CTableDataCell>{parametro.observaciones || '-'}</CTableDataCell>
              <CTableDataCell>
                <CButton 
                  color="primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => onEdit(parametro)}
                >
                  Editar
                </CButton>
                <CButton 
                  color="danger" 
                  size="sm"
                  onClick={() => handleDelete(parametro.clave)}
                >
                  Eliminar
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))
        )}
      </CTableBody>
    </CTable>
  );
};

export default GlobalTable;