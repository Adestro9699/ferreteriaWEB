import React from 'react';
import { CContainer } from '@coreui/react';
import TransferenciasTabs from '../../components/transferenciaComp/TransferenciasTabs';

const Transferencias = () => {
  return (
    <CContainer fluid>
      <div className="mb-4">
        <h4 className="mb-0">Transferencias</h4>
        <small className="text-muted">Gestión de transferencias entre almacenes</small>
      </div>
      
      <TransferenciasTabs />
    </CContainer>
  );
};

export default Transferencias; 