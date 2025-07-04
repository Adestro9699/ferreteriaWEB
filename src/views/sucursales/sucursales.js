import React from 'react';
import { CContainer } from '@coreui/react';
import SucursalesTable from '../../components/sucursalComp/SucursalesTable';

const Sucursales = () => {
  return (
    <CContainer fluid>
      <div className="mb-4">
        <h4 className="mb-0">Sucursales</h4>
        <small className="text-muted">Gestión de sucursales de la empresa</small>
      </div>
      
      <SucursalesTable />
    </CContainer>
  );
};

export default Sucursales; 