import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react';
import UnidadMedidaTable from '../../components/utilidadComp/UnidadMedidaTable';
import UnidadMedidaForm from '../../components/utilidadComp/UnidadMedidaForm';

const UnidadMedida = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, color = 'success') => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      color,
      show: true
    };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  const handleEdit = (unidad) => {
    setSelectedUnidad(unidad);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedUnidad(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setSelectedUnidad(null);
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Gestión de Unidades de Medida</strong>
              {!showForm && (
                <CButton color="primary" onClick={() => setShowForm(true)}>
                  Nueva Unidad de Medida
                </CButton>
              )}
            </CCardHeader>
            <CCardBody>
              {showForm ? (
                <UnidadMedidaForm
                  unidadMedida={selectedUnidad}
                  onCancel={handleCancel}
                  onSaved={handleSaved}
                  onToast={addToast}
                />
              ) : (
                <UnidadMedidaTable 
                  onEdit={handleEdit} 
                  onToast={addToast}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Toaster para notificaciones */}
      <CToaster placement="bottom-end">
        {toasts.map((toast) => (
          <CToast
            key={toast.id}
            autohide={true}
            delay={3000}
            color={toast.color}
            visible={toast.show}
          >
            <CToastHeader closeButton>
              {toast.color === 'success' ? 'Éxito' : 'Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </>
  );
};

export default UnidadMedida; 