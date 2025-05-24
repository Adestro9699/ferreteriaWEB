import React, { useState } from 'react';
import { 
  CButton, 
  CDropdown, 
  CDropdownToggle, 
  CDropdownMenu, 
  CDropdownItem,
  CSpinner
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilCloudDownload, cilFile, cilSpreadsheet } from '@coreui/icons';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const ProductoExport = ({ data, className }) => {
  const [loading, setLoading] = useState(false);
  
  // Función para exportar a Excel
  const exportToExcel = () => {
    setLoading(true);
    
    try {
      // Preparar los datos para exportar (excluir propiedades no deseadas o dar formato)
      const exportData = data.map(item => ({
        'ID': item.idProducto,
        'Nombre': item.nombreProducto,
        'Descripción': item.descripcion || '',
        'Precio': item.precio,
        'Stock': item.stock,
        'Marca': item.marca || '',
        'Categoría': item.subcategoria?.categoria?.nombre || '',
        'Subcategoría': item.subcategoria?.nombre || '',
        'Estado': item.estadoProducto,
        'Fecha Modificación': item.fechaModificacion
      }));

      // Crear una hoja de trabajo
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

      // Generar el archivo y descargarlo
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      saveAs(blob, `productos_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // Función para exportar a CSV
  const exportToCSV = () => {
    setLoading(true);
    
    try {
      // Preparar los datos para exportar
      const exportData = data.map(item => ({
        'ID': item.idProducto,
        'Nombre': item.nombreProducto,
        'Descripción': item.descripcion || '',
        'Precio': item.precio,
        'Stock': item.stock,
        'Marca': item.marca || '',
        'Categoría': item.subcategoria?.categoria?.nombre || '',
        'Subcategoría': item.subcategoria?.nombre || '',
        'Estado': item.estadoProducto,
        'Fecha Modificación': item.fechaModificacion
      }));

      // Convertir a CSV
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
      
      // Crear el blob y descargarlo
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `productos_${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <CDropdown>
      <CDropdownToggle 
        color="success" 
        variant="outline" 
        disabled={loading}
        className={`d-flex align-items-center justify-content-center shadow-sm ${className}`}
      >
        {loading ? (
          <CSpinner size="sm" color="success" className="me-1" />
        ) : (
          <CIcon icon={cilCloudDownload} className="me-1" />
        )}
        <span className="d-none d-lg-inline">Exportar</span>
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem onClick={exportToExcel}>
          <CIcon icon={cilSpreadsheet} className="me-2 text-success" />
          Exportar a Excel
        </CDropdownItem>
        <CDropdownItem onClick={exportToCSV}>
          <CIcon icon={cilFile} className="me-2 text-primary" />
          Exportar a CSV
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default ProductoExport;