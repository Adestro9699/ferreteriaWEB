import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CSpinner,
} from '@coreui/react';
import { cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import apiClient from '../../services/apiClient';
import CrearCliente from './crearCliente'; // Importar el componente CrearCliente

const MostrarCliente = ({ visible, onClose, onSeleccionarCliente }) => {
  const [clientes, setClientes] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalCrearClienteVisible, setModalCrearClienteVisible] = useState(false); // Estado para controlar la visibilidad del modal CrearCliente
  
  // Estados para la paginación
  const [pagina, setPagina] = useState(0);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);

  // Obtener clientes del backend con paginación
  const fetchClientes = async (paginaActual = pagina, registrosPorPaginaActual = registrosPorPagina) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/clientes/paginacion-dinamica?pagina=${paginaActual}&registrosPorPagina=${registrosPorPaginaActual}`);
      setClientes(response.data.content);
      setTotalPaginas(response.data.totalPages);
      setTotalRegistros(response.data.totalElements);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchClientes();
    }
  }, [visible]);

  // Manejar cambio de página
  const handlePageChange = (nuevaPagina) => {
    setPagina(nuevaPagina);
    fetchClientes(nuevaPagina, registrosPorPagina);
  };

  // Manejar cambio de registros por página
  const handleRegistrosPorPaginaChange = (e) => {
    const nuevoValor = parseInt(e.target.value);
    setRegistrosPorPagina(nuevoValor);
    setPagina(0); // Resetear a la primera página
    fetchClientes(0, nuevoValor);
  };

  // Manejar la búsqueda de clientes
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setFilterText(value);

    try {
      let resultados = [];

      if (value.length > 0) {
        if (/^\d+$/.test(value)) {
          const response = await apiClient.get(`/clientes/buscarPorNumeroDocumento?numeroDocumento=${value}`);
          if (response.data) {
            resultados = Array.isArray(response.data) ? response.data : [response.data];
          }
        } else {
          const endpoints = [
            `/clientes/buscarPorNombre?nombres=${encodeURIComponent(value)}`,
            `/clientes/buscarPorApellido?apellidos=${encodeURIComponent(value)}`,
            `/clientes/buscarPorRazonSocial?razonSocial=${encodeURIComponent(value)}`
          ];

          const responses = await Promise.all(
            endpoints.map((endpoint) => apiClient.get(endpoint).catch(() => null))
          );

          resultados = responses
            .filter((response) => response && response.data)
            .flatMap((response) => (Array.isArray(response.data) ? response.data : [response.data]));

          const uniqueResults = Array.from(new Set(resultados.map((c) => c.idCliente))).map(
            (id) => resultados.find((c) => c.idCliente === id)
          );

          resultados = uniqueResults;
        }
      } else {
        fetchClientes(0, registrosPorPagina);
        return;
      }

      setClientes(resultados);
      setTotalPaginas(Math.ceil(resultados.length / registrosPorPagina));
      setTotalRegistros(resultados.length);
    } catch (error) {
      console.error('Error al buscar los datos:', error);
    }
  };

  // Limpiar la búsqueda
  const clearSearch = async () => {
    setFilterText('');
    fetchClientes(0, registrosPorPagina);
  };

  // Guardar nuevo cliente
  const handleGuardarCliente = async (nuevoCliente) => {
    try {
      const response = await apiClient.post('/clientes', nuevoCliente);
      fetchClientes(pagina, registrosPorPagina); // Recargar la página actual
      setModalCrearClienteVisible(false);
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
    }
  };

  return (
    <>
      {/* Modal para mostrar la lista de clientes */}
      <CModal visible={visible} onClose={onClose} className="custom-lg-modal" backdrop="static">
        <CModalHeader closeButton={false}>
          <CModalTitle>Seleccionar Cliente</CModalTitle>
          <div style={{ marginLeft: 'auto' }}>
            <CButton color="success" onClick={() => setModalCrearClienteVisible(true)} style={{ marginRight: '10px' }}>
              Crear Cliente
            </CButton>
            <CButton color="primary" onClick={onClose}>
              Listo
            </CButton>
          </div>
        </CModalHeader>
        <CModalBody>
          {/* Barra de búsqueda */}
          <CInputGroup className="mb-3">
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

          {/* Controles de paginación */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <span className="me-2">Mostrar</span>
              <CFormSelect
                value={registrosPorPagina}
                onChange={handleRegistrosPorPaginaChange}
                style={{ width: '80px' }}
              >
                {[5, 10, 20, 50, 100].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </CFormSelect>
              <span className="ms-2">registros</span>
            </div>
            <div>
              <span className="me-2">
                Mostrando {clientes.length} de {totalRegistros} registros
              </span>
            </div>
          </div>

          {/* Tabla de clientes */}
          {loading ? (
            <div className="text-center my-4">
              <CSpinner color="primary" />
              <span className="ms-2">Cargando clientes...</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>DNI/RUC</CTableHeaderCell>
                    <CTableHeaderCell>Número de Documento</CTableHeaderCell>
                    <CTableHeaderCell>Nombres</CTableHeaderCell>
                    <CTableHeaderCell>Apellidos</CTableHeaderCell>
                    <CTableHeaderCell>Razón Social</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {clientes.map((cliente) => (
                    <CTableRow key={cliente.idCliente}>
                      <CTableDataCell>{cliente.tipoDocumento.abreviatura}</CTableDataCell>
                      <CTableDataCell>{cliente.numeroDocumento}</CTableDataCell>
                      <CTableDataCell>{cliente.nombres}</CTableDataCell>
                      <CTableDataCell>{cliente.apellidos}</CTableDataCell>
                      <CTableDataCell>{cliente.razonSocial}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() => onSeleccionarCliente(cliente)}
                        >
                          Seleccionar
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              {/* Paginación */}
              <div className="d-flex justify-content-center mt-3">
                <CPagination>
                  <CPaginationItem
                    disabled={pagina === 0}
                    onClick={() => handlePageChange(0)}
                    style={{ cursor: 'pointer' }}
                  >
                    Primera
                  </CPaginationItem>
                  <CPaginationItem
                    disabled={pagina === 0}
                    onClick={() => handlePageChange(pagina - 1)}
                    style={{ cursor: 'pointer' }}
                  >
                    Anterior
                  </CPaginationItem>
                  
                  {[...Array(totalPaginas)].map((_, index) => (
                    <CPaginationItem
                      key={index}
                      active={index === pagina}
                      onClick={() => handlePageChange(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ))}

                  <CPaginationItem
                    disabled={pagina === totalPaginas - 1}
                    onClick={() => handlePageChange(pagina + 1)}
                    style={{ cursor: 'pointer' }}
                  >
                    Siguiente
                  </CPaginationItem>
                  <CPaginationItem
                    disabled={pagina === totalPaginas - 1}
                    onClick={() => handlePageChange(totalPaginas - 1)}
                    style={{ cursor: 'pointer' }}
                  >
                    Última
                  </CPaginationItem>
                </CPagination>
              </div>
            </>
          )}
        </CModalBody>
      </CModal>

      {/* Modal para crear un nuevo cliente */}
      <CrearCliente
        visible={modalCrearClienteVisible}
        onClose={() => setModalCrearClienteVisible(false)}
        onGuardar={handleGuardarCliente}
      />
    </>
  );
};

export default MostrarCliente;