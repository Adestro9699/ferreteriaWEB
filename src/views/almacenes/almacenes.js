import React from 'react';
import { CContainer } from '@coreui/react';
import AlmacenesTable from '../../components/almacenComp/AlmacenesTable';

const Almacenes = () => {
  return (
    <CContainer fluid>
      <div className="mb-4">
        <h4 className="mb-0">Almacenes</h4>
        <small className="text-muted">Gestión de almacenes de la empresa</small>
      </div>
      
      <AlmacenesTable />
    </CContainer>
  );
};

export default Almacenes; 