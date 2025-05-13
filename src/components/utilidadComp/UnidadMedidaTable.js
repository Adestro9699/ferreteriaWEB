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

const UnidadMedidaTable = ({ onEdit, onToast }) => {
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnidadesMedida = async () => {
    try {
      const response = await apiClient.get('/fs/unidades-medida');
      setUnidadesMedida(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = 'Error al cargar las unidades de medida';
      setError(errorMessage);
      onToast(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnidadesMedida();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta unidad de medida?')) {
      try {
        await apiClient.delete(`/fs/unidades-medida/${id}`);
        onToast('Unidad de medida eliminada exitosamente', 'success');
        fetchUnidadesMedida(); // Recargar la tabla
      } catch (err) {
        const errorMessage = 'Error al eliminar la unidad de medida';
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
          <CTableHeaderCell>Abreviatura</CTableHeaderCell>
          <CTableHeaderCell>Descripción</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {unidadesMedida.map((unidad) => (
          <CTableRow key={unidad.idUnidadMedida}>
            <CTableDataCell>{unidad.idUnidadMedida}</CTableDataCell>
            <CTableDataCell>{unidad.nombreUnidad}</CTableDataCell>
            <CTableDataCell>{unidad.abreviatura}</CTableDataCell>
            <CTableDataCell>{unidad.descripcion}</CTableDataCell>
            <CTableDataCell>
              <CButton
                color="primary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(unidad)}
              >
                Editar
              </CButton>
              <CButton
                color="danger"
                size="sm"
                onClick={() => handleDelete(unidad.idUnidadMedida)}
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

export default UnidadMedidaTable; 