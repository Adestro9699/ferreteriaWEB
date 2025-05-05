import React, { useState, useEffect } from 'react'
import {
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CBadge,
} from '@coreui/react'
import { cilPlus, cilInfo, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import PaginationCompra from './PaginationCompra';
import CompraFilters from './CompraFilters';
import CrearProducto from '../productoComp/CrearProducto';
import apiClient from '../../services/apiClient';
import { CToast, CToastBody, CToastClose, CToaster } from '@coreui/react';

const CompraList = ({ compras, onNuevaCompra, onVerDetalle, onEditarCompra, onEliminarCompra }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCrearProductoModal, setShowCrearProductoModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '', color: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasRes, proveedoresRes, subcategoriasRes, unidadesMedidaRes] = await Promise.all([
          apiClient.get('/fs/categorias'),
          apiClient.get('/fs/proveedores'),
          apiClient.get('/fs/subcategorias'),
          apiClient.get('/fs/unidades-medida')
        ]);

        setCategorias(categoriasRes.data);
        setProveedores(proveedoresRes.data);
        setSubcategorias(subcategoriasRes.data);
        setUnidadesMedida(unidadesMedidaRes.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page change
  };

  const sortedCompras = [...compras].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredCompras = compras.filter((compra) => {
    const matchesSearchTerm =
      compra.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.fechaCompra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.tipoDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.totalCompra.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.observaciones.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatusFilter =
      statusFilter === 'all' || statusFilter === '' || compra.estadoCompra === statusFilter;

    return matchesSearchTerm && matchesStatusFilter;
  });

  const paginatedCompras = filteredCompras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleProductoCreado = (nuevoProducto) => {
    setShowCrearProductoModal(false);
    setToast({ visible: true, message: 'Producto creado exitosamente', color: 'success' });
    setTimeout(() => setToast({ visible: false, message: '', color: '' }), 3000); // Ocultar toast después de 3 segundos
  };

  return (
    <div>
      <CToaster position="bottom-right" style={{ bottom: '20px', right: '20px' }}>
        <CToast visible={toast.visible} color={toast.color} className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody>{toast.message}</CToastBody>
            <CToastClose className="me-2 m-auto" />
          </div>
        </CToast>
      </CToaster>
      <div className="d-flex justify-content-between mb-3">
        <CompraFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          clearSearch={clearSearch}
        />
        <div className="d-flex gap-2">
          <CButton color="primary" onClick={onNuevaCompra}>
            <CIcon icon={cilPlus} className="me-2" />
            Nueva Compra
          </CButton>
          <CButton color="success" onClick={() => setShowCrearProductoModal(true)}>
            <CIcon icon={cilPlus} className="me-2" />
            Crear Producto
          </CButton>
        </div>
      </div>
      <h5>Lista de Compras</h5>
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell onClick={() => handleSort('numeroFactura')}>
              N° Factura {sortConfig.key === 'numeroFactura' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => handleSort('fechaCompra')}>
              Fecha {sortConfig.key === 'fechaCompra' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => handleSort('tipoDocumento')}>
              Tipo Documento {sortConfig.key === 'tipoDocumento' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => handleSort('proveedor.nombre')}>
              Proveedor {sortConfig.key === 'proveedor.nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => handleSort('totalCompra')}>
              Total {sortConfig.key === 'totalCompra' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </CTableHeaderCell>
            <CTableHeaderCell>Obervaciones</CTableHeaderCell>
            <CTableHeaderCell>Estado</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {paginatedCompras.map((compra) => (
            <CTableRow key={compra.idCompra}>
              <CTableDataCell>{compra.numeroFactura}</CTableDataCell>
              <CTableDataCell>{formatDate(compra.fechaCompra)}</CTableDataCell>
              <CTableDataCell>{compra.tipoDocumento}</CTableDataCell>
              <CTableDataCell>{compra.proveedor.nombre}</CTableDataCell>
              <CTableDataCell>
                {formatCurrency(compra.totalCompra || 0)}
              </CTableDataCell>
              <CTableDataCell style={{ maxWidth: '200px', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                {compra.observaciones}
              </CTableDataCell>
              <CTableDataCell>
                <CBadge 
                  color={compra.estadoCompra === 'COMPLETADA' ? 'success' : 'warning'}
                >
                  {compra.estadoCompra || 'PENDIENTE'}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell className="d-flex gap-2">
                <CButton 
                  color="info" 
                  size="sm" 
                  onClick={() => onVerDetalle(compra)}
                >
                  Ver Detalle
                </CButton>
                {compra.estadoCompra === 'PENDIENTE' ? (
                  <CButton 
                    color="warning" 
                    size="sm" 
                    onClick={() => onEditarCompra(compra)}
                  >
                    <CIcon icon={cilPencil} className="me-1" />
                    Editar
                  </CButton>
                ) : null}
                <CButton 
                  color="danger" 
                  size="sm" 
                  onClick={() => onEliminarCompra(compra)}
                >
                  <CIcon icon={cilTrash} className="me-1" />
                  Eliminar
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <PaginationCompra
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={Math.ceil(compras.length / itemsPerPage)}
        itemsPerPage={itemsPerPage}
        handleItemsPerPageChange={handleItemsPerPageChange}
      />
      <CrearProducto
        show={showCrearProductoModal}
        onClose={() => setShowCrearProductoModal(false)}
        onSave={handleProductoCreado}
        categorias={categorias}
        proveedores={proveedores}
        subcategorias={subcategorias}
        unidadesMedida={unidadesMedida}
      />
      <CToaster position="bottom-right" style={{ bottom: '20px', right: '20px' }}>
        {toast.visible && (
          <CToast color={toast.color} autohide={true} fade={true}>
            <CToastBody>{toast.message}</CToastBody>
            <CToastClose />
          </CToast>
        )}
      </CToaster>
    </div>
  );
};

export default CompraList;