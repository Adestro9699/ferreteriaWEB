import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CSpinner,
} from '@coreui/react';
import apiClient from '../../services/apiClient';
import PropTypes from 'prop-types';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';

const TipoDocumentoTable = ({ onEdit, onToast }) => {
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTiposDocumento = async () => {
    try {
      const response = await apiClient.get('/tipos-documento');
      setTiposDocumento(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = 'Error al cargar los tipos de documento';
      setError(errorMessage);
      onToast(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposDocumento();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este tipo de documento?')) {
      try {
        await apiClient.delete(`/tipos-documento/${id}`);
        onToast('Tipo de documento eliminado exitosamente', 'success');
        fetchTiposDocumento(); // Recargar la tabla
      } catch (err) {
        const errorMessage = 'Error al eliminar el tipo de documento';
        setError(errorMessage);
        onToast(errorMessage, 'danger');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <CSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <CTable hover>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>ID</CTableHeaderCell>
          <CTableHeaderCell>Nombre</CTableHeaderCell>
          <CTableHeaderCell>Código NubeFact</CTableHeaderCell>
          <CTableHeaderCell>Abreviatura</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {tiposDocumento.map((tipoDoc) => (
          <CTableRow key={tipoDoc.idTipoDocumento}>
            <CTableDataCell>{tipoDoc.idTipoDocumento}</CTableDataCell>
            <CTableDataCell>{tipoDoc.nombre}</CTableDataCell>
            <CTableDataCell>{tipoDoc.codigoNubeFact}</CTableDataCell>
            <CTableDataCell>{tipoDoc.abreviatura}</CTableDataCell>
            <CTableDataCell>
              <CButton
                color="primary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(tipoDoc)}
              >
                Editar
              </CButton>
              <CButton
                color="danger"
                size="sm"
                onClick={() => handleDelete(tipoDoc.idTipoDocumento)}
              >
                Eliminar
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

TipoDocumentoTable.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onToast: PropTypes.func.isRequired
};

export default TipoDocumentoTable; 