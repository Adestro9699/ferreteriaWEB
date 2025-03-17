import React from 'react';
import { CToaster, CToast, CToastHeader, CToastBody } from '@coreui/react';

const ProductoToasts = ({ toasts }) => {
  return (
    <CToaster placement="bottom-end">
      {toasts.map((toast) => (
        <CToast key={toast.id} visible={true} color={toast.color} autohide={true} delay={3000}>
          <CToastHeader closeButton>
            <strong className="me-auto">Notificación</strong>
          </CToastHeader>
          <CToastBody>{toast.message}</CToastBody>
        </CToast>
      ))}
    </CToaster>
  );
};

export default ProductoToasts;