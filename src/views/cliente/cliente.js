import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CCollapse,
  CFormInput,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CContainer,
  CRow,
  CCol,
  CFormCheck,
  CForm,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react';
import { cilPencil, cilTrash, cilX, cilSortAlphaDown, cilSortAlphaUp, cilCloudDownload } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import apiClient from '../../services/apiClient';

const getBadge = (status) => {
  switch (status) {
    case 'ACTIVO':
      return 'success';
    case 'INACTIVO':
      return 'secondary';
    case 'PENDIENTE':
      return 'warning';
    case 'BANEADO':
      return 'danger';
    default:
      return 'primary';
  }
};

const ExportButton = ({ exportData }) => {
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

const Clientes = () => {
  const [details, setDetails] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortColumn, setSortColumn] = useState('nombres');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    tipoDocumento: '',
    estado: '',
  });
  const [clientes, setClientes] = useState([]); // Cambiado de "items" a "clientes"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  // Obtener datos del backend (clientes)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/fs/clientes');
        setClientes(response.data); // Cambiado de "items" a "clientes"
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mostrar notificaciones
  const addToast = (message, color = 'success') => {
    const newToast = {
      id: Date.now(),
      message,
      color,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 5000);
  };

  // Búsqueda avanzada
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setFilterText(value);

    try {
      let resultados = [];

      if (value.length > 0) {
        // Si el valor es un número, buscar por número de documento
        if (/^\d+$/.test(value)) {
          const response = await apiClient.get(`/fs/clientes/buscarPorNumeroDocumento?numeroDocumento=${value}`);
          if (response.data) {
            resultados = Array.isArray(response.data) ? response.data : [response.data];
          }
        } else {
          // Si el valor es un texto, buscar por nombre, apellido y razón social
          const endpoints = [
            `/fs/clientes/buscarPorNombre?nombres=${encodeURIComponent(value)}`,
            `/fs/clientes/buscarPorApellido?apellidos=${encodeURIComponent(value)}`,
            `/fs/clientes/buscarPorRazonSocial?razonSocial=${encodeURIComponent(value)}`,
          ];

          const responses = await Promise.all(
            endpoints.map((endpoint) => apiClient.get(endpoint).catch(() => null))
          );

          // Combinar resultados y eliminar duplicados
          resultados = responses
            .filter((response) => response && response.data) // Filtrar respuestas válidas
            .flatMap((response) => (Array.isArray(response.data) ? response.data : [response.data])); // Asegurar que los datos sean un array

          const uniqueResults = Array.from(new Set(resultados.map((c) => c.idCliente))).map(
            (id) => resultados.find((c) => c.idCliente === id)
          );

          resultados = uniqueResults;
        }
      } else {
        // Si no hay valor de búsqueda, cargar todos los clientes
        const response = await apiClient.get('/fs/clientes');
        resultados = response.data;
      }

      setClientes(resultados); // Actualizar la lista de clientes
    } catch (error) {
      console.error('Error al buscar los datos:', error);
      addToast('Error al buscar los datos', 'danger');
    }
  };

  // Limpiar la búsqueda
  const clearSearch = async () => {
    setFilterText('');
    try {
      const response = await apiClient.get('/fs/clientes');
      setClientes(response.data); // Cargar todos los clientes
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      addToast('Error al cargar los datos', 'danger');
    }
  };

  // Ordenamiento
  const sortedClientes = clientes.sort((a, b) => {
    if (!a || !b || !a[sortColumn] || !b[sortColumn]) return 0;

    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = sortedClientes.slice(indexOfFirstItem, indexOfLastItem);

  // Selección de clientes
  const handleSelectCliente = (id) => {
    const isSelected = selectedItems.includes(id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((clienteId) => clienteId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Eliminar clientes seleccionados
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      addToast('No hay clientes seleccionados para eliminar', 'warning');
      return;
    }

    try {
      await apiClient.delete('/fs/clientes/eliminar-multiples', {
        data: selectedItems,
      });

      const updatedClientes = clientes.filter((cliente) => !selectedItems.includes(cliente.idCliente));
      setClientes(updatedClientes);
      setSelectedItems([]);
      addToast('Clientes eliminados correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar los clientes:', error);
      addToast('Error al eliminar los clientes', 'danger');
    }
  };

  // Abrir modal de edición
  const handleEdit = (cliente) => {
    setCurrentCliente(cliente);
    setShowEditModal(true);
  };

  // Guardar cambios en la edición
  const handleSaveChanges = async () => {
    if (!currentCliente) return;

    try {
      const response = await apiClient.put(
        `/fs/clientes/${currentCliente.idCliente}`,
        currentCliente
      );

      const updatedClientes = clientes.map((cliente) =>
        cliente.idCliente === currentCliente.idCliente ? currentCliente : cliente
      );
      setClientes(updatedClientes);
      addToast('Cliente actualizado correctamente', 'success');
      setShowEditModal(false);
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
      addToast('Error al actualizar el cliente', 'danger');
    }
  };

  // Confirmar eliminación de un cliente
  const confirmDelete = (id) => {
    setClienteToDelete(id);
    setShowDeleteConfirmation(true);
  };

  // Eliminar un cliente después de confirmar
  const handleDelete = async () => {
    if (!clienteToDelete) return;

    try {
      await apiClient.delete(`/fs/clientes/${clienteToDelete}`);

      const updatedClientes = clientes.filter((cliente) => cliente.idCliente !== clienteToDelete);
      setClientes(updatedClientes);
      addToast('Cliente eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      addToast('Error al eliminar el cliente', 'danger');
    } finally {
      setShowDeleteConfirmation(false);
      setClienteToDelete(null);
    }
  };

  // Mostrar mensaje de carga o error
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CContainer>
      {/* Barra de búsqueda y botón de exportación */}
      <CRow className="mb-3 align-items-center">
        <CCol>
          <CInputGroup>
            <CFormInput
              type="text"
              placeholder="Buscar por nombres, apellidos, razón social, etc..."
              value={filterText}
              onChange={handleSearchChange}
            />
            <CInputGroupText>
              <CButton color="light" onClick={clearSearch}>
                <CIcon icon={cilX} />
              </CButton>
            </CInputGroupText>
          </CInputGroup>
        </CCol>
        <CCol xs="auto">
          <ExportButton exportData={() => { }} />
        </CCol>
      </CRow>

      {/* Tabla */}
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>
              <CFormCheck
                checked={selectedItems.length === currentClientes.length}
                onChange={() => setSelectedItems(currentClientes.map((cliente) => cliente.idCliente))}
              />
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => handleAdvancedSort('tipoDocumento')}>
              Tipo de Documento {sortColumn === 'tipoDocumento' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => handleAdvancedSort('numeroDocumento')}>
              Número de Documento {sortColumn === 'numeroDocumento' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => handleAdvancedSort('nombres')}>
              Nombres {sortColumn === 'nombres' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => handleAdvancedSort('apellidos')}>
              Apellidos {sortColumn === 'apellidos' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => handleAdvancedSort('razonSocial')}>
              Razón Social {sortColumn === 'razonSocial' && (sortDirection === 'asc' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />)}
            </CTableHeaderCell>
            <CTableHeaderCell>Dirección</CTableHeaderCell>
            <CTableHeaderCell>Teléfono</CTableHeaderCell>
            <CTableHeaderCell>Correo</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentClientes.map((cliente) => (
            <CTableRow key={cliente.idCliente}>
              <CTableDataCell>
                <CFormCheck
                  checked={selectedItems.includes(cliente.idCliente)}
                  onChange={() => handleSelectCliente(cliente.idCliente)}
                />
              </CTableDataCell>
              <CTableDataCell>{cliente.tipoDocumento.nombre}</CTableDataCell>
              <CTableDataCell>{cliente.numeroDocumento}</CTableDataCell>
              <CTableDataCell>{cliente.nombres}</CTableDataCell>
              <CTableDataCell>{cliente.apellidos}</CTableDataCell>
              <CTableDataCell>{cliente.razonSocial}</CTableDataCell>
              <CTableDataCell>{cliente.direccion}</CTableDataCell>
              <CTableDataCell>{cliente.telefono}</CTableDataCell>
              <CTableDataCell>{cliente.correo}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(cliente)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger"
                  size="sm"
                  onClick={() => confirmDelete(cliente.idCliente)}
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Paginación */}
      <CRow className="mt-3 align-items-center">
        <CCol>
          <CPagination>
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </CPaginationItem>
            {Array.from({ length: Math.ceil(sortedClientes.length / itemsPerPage) }, (_, i) => (
              <CPaginationItem
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === Math.ceil(sortedClientes.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </CPaginationItem>
          </CPagination>
        </CCol>
        <CCol xs="auto">
          <CFormSelect
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={30}>30 por página</option>
          </CFormSelect>
        </CCol>
      </CRow>

      {/* Modal de Edición */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Editar Cliente</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {currentCliente && (
            <CForm>
              <CFormLabel>Tipo de Documento</CFormLabel>
              <CFormInput
                type="text"
                value={currentCliente.tipoDocumento.nombre}
                onChange={(e) =>
                  setCurrentCliente({
                    ...currentCliente,
                    tipoDocumento: { ...currentCliente.tipoDocumento, nombre: e.target.value },
                  })
                }
              />

              <CFormLabel className="mt-3">Número de Documento</CFormLabel>
              <CFormInput
                type="text"
                value={currentCliente.numeroDocumento}
                onChange={(e) =>
                  setCurrentCliente({ ...currentCliente, numeroDocumento: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Nombres</CFormLabel>
              <CFormInput
                type="text"
                value={currentCliente.nombres}
                onChange={(e) =>
                  setCurrentCliente({ ...currentCliente, nombres: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Apellidos</CFormLabel>
              <CFormInput
                type="text"
                value={currentCliente.apellidos}
                onChange={(e) =>
                  setCurrentCliente({ ...currentCliente, apellidos: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Razón Social</CFormLabel>
              <CFormInput
                type="text"
                value={currentCliente.razonSocial}
                onChange={(e) =>
                  setCurrentCliente({ ...currentCliente, razonSocial: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Dirección</CFormLabel>
              <CFormInput
                type="text"
                value={currentCliente.direccion}
                onChange={(e) =>
                  setCurrentCliente({ ...currentCliente, direccion: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Teléfono</CFormLabel>
              <CFormInput
                type="text"
                value={currentCliente.telefono}
                onChange={(e) =>
                  setCurrentCliente({ ...currentCliente, telefono: e.target.value })
                }
              />

              <CFormLabel className="mt-3">Correo</CFormLabel>
              <CFormInput
                type="email"
                value={currentCliente.correo}
                onChange={(e) =>
                  setCurrentCliente({ ...currentCliente, correo: e.target.value })
                }
              />
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Confirmación para Eliminar */}
      <CModal visible={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro de que deseas eliminar este cliente?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Notificaciones (Toasts) */}
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
    </CContainer>
  );
};

export default Clientes;