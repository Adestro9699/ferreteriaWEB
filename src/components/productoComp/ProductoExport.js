import React from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import { CIcon } from '@coreui/icons-react'

import { cilCloudDownload } from '@coreui/icons';

const ProductoExport = ({ exportData }) => {
  return (
    <CDropdown>
      <CDropdownToggle color="secondary">
        <CIcon icon={cilCloudDownload} className="me-2" />
        Exportar
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem onClick={() => exportData('Excel')}>Excel</CDropdownItem>
        <CDropdownItem onClick={() => exportData('CSV')}>CSV</CDropdownItem>
        <CDropdownItem onClick={() => exportData('PDF')}>PDF</CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default ProductoExport;