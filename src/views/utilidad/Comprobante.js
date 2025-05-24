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
import ComprobanteTable from '../../components/utilidadComp/ComprobanteTable';
import ComprobanteForm from '../../components/utilidadComp/ComprobanteForm';

const Comprobante = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedComprobante, setSelectedComprobante] = useState(null);
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
    
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  const handleEdit = (comprobante) => {
    setSelectedComprobante(comprobante);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedComprobante(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setSelectedComprobante(null);
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Gestión de Tipos de Comprobante</strong>
              {!showForm && (
                <CButton color="primary" onClick={() => setShowForm(true)}>
                  Nuevo Tipo de Comprobante
                </CButton>
              )}
            </CCardHeader>
            <CCardBody>
              {showForm ? (
                <ComprobanteForm
                  comprobante={selectedComprobante}
                  onCancel={handleCancel}
                  onSaved={handleSaved}
                  onToast={addToast}
                />
              ) : (
                <ComprobanteTable 
                  onEdit={handleEdit} 
                  onToast={addToast}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

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

export default Comprobante; 