import React from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';
import * as XLSX from 'xlsx';

const ProductoExport = ({ data }) => {
  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    XLSX.writeFile(workbook, 'productos.xlsx');
  };

  // Función para exportar a CSV
  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'productos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CDropdown>
      <CDropdownToggle color="secondary">
        <CIcon icon={cilCloudDownload} className="me-2" />
        Exportar
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem onClick={exportToExcel}>Excel</CDropdownItem>
        <CDropdownItem onClick={exportToCSV}>CSV</CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default ProductoExport;