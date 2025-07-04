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
import TipoDocumentoTable from '../../components/utilidadComp/TipoDocumentoTable';
import TipoDocumentoForm from '../../components/utilidadComp/TipoDocumentoForm';

const TipoDocumento = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedTipoDoc, setSelectedTipoDoc] = useState(null);
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

  const handleEdit = (tipoDoc) => {
    setSelectedTipoDoc(tipoDoc);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedTipoDoc(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setSelectedTipoDoc(null);
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Gestión de Tipos de Documento</strong>
              {!showForm && (
                <CButton color="primary" onClick={() => setShowForm(true)}>
                  Nuevo Tipo de Documento
                </CButton>
              )}
            </CCardHeader>
            <CCardBody>
              {showForm ? (
                <TipoDocumentoForm
                  tipoDocumento={selectedTipoDoc}
                  onCancel={handleCancel}
                  onSaved={handleSaved}
                  onToast={addToast}
                />
              ) : (
                <TipoDocumentoTable 
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

export default TipoDocumento; 