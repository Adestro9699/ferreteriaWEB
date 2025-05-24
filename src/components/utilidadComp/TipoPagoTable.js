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
  CBadge,
} from '@coreui/react';
import apiClient from '../../services/apiClient';

const TipoPagoTable = ({ onEdit, onToast }) => {
  const [tiposPago, setTiposPago] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTiposPago();
  }, []);

  const fetchTiposPago = async () => {
    try {
      const response = await apiClient.get('/tipos-pago');
      setTiposPago(response.data);
    } catch (error) {
      console.error('Error al cargar tipos de pago:', error);
      onToast('Error al cargar los tipos de pago', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este tipo de pago?')) {
      try {
        const response = await apiClient.delete(`/tipos-pago/${id}`);
        // Verificamos si la respuesta es exitosa (204 No Content o 200 OK)
        if (response.status === 204 || response.status === 200) {
          onToast('Tipo de pago eliminado exitosamente');
          fetchTiposPago();
        } else {
          onToast('No se pudo eliminar el tipo de pago', 'warning');
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
        if (error.response?.status === 404) {
          onToast('El tipo de pago no fue encontrado', 'warning');
        } else {
          onToast('Error al eliminar el tipo de pago', 'danger');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Código</CTableHeaderCell>
          <CTableHeaderCell>Nombre</CTableHeaderCell>
          <CTableHeaderCell>Descripción</CTableHeaderCell>
          <CTableHeaderCell>Comisión (%)</CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
          <CTableHeaderCell>Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {tiposPago.map((tipoPago) => (
          <CTableRow key={tipoPago.idTipoPago}>
            <CTableDataCell>{tipoPago.codigoTipoPago}</CTableDataCell>
            <CTableDataCell>{tipoPago.nombre}</CTableDataCell>
            <CTableDataCell>{tipoPago.descripcionTipoPago}</CTableDataCell>
            <CTableDataCell>{tipoPago.comision}%</CTableDataCell>
            <CTableDataCell>
              <CBadge color={tipoPago.estadoTipoPago === 'ACTIVO' ? 'success' : 'danger'}>
                {tipoPago.estadoTipoPago}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton
                color="primary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(tipoPago)}
              >
                Editar
              </CButton>
              <CButton
                color="danger"
                size="sm"
                onClick={() => handleDelete(tipoPago.idTipoPago)}
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

export default TipoPagoTable; 