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

  // Obtener clientes del backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await apiClient.get('/fs/clientes');
        setClientes(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Manejar la búsqueda de clientes
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setFilterText(value);

    try {
      let resultados = [];

      if (value.length > 0) {
        if (/^\d+$/.test(value)) {
          const response = await apiClient.get(`/fs/clientes/buscarPorNumeroDocumento?numeroDocumento=${value}`);
          if (response.data) {
            resultados = Array.isArray(response.data) ? response.data : [response.data];
          }
        } else {
          const endpoints = [
            `/fs/clientes/buscarPorNombre?nombres=${encodeURIComponent(value)}`,
            `/fs/clientes/buscarPorApellido?apellidos=${encodeURIComponent(value)}`,
            `/fs/clientes/buscarPorRazonSocial?razonSocial=${encodeURIComponent(value)}`,
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
        const response = await apiClient.get('/fs/clientes');
        resultados = response.data;
      }

      setClientes(resultados);
    } catch (error) {
      console.error('Error al buscar los datos:', error);
    }
  };

  // Limpiar la búsqueda
  const clearSearch = async () => {
    setFilterText('');
    try {
      const response = await apiClient.get('/fs/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  // Guardar nuevo cliente
  const handleGuardarCliente = async (nuevoCliente) => {
    try {
      const response = await apiClient.post('/fs/clientes', nuevoCliente);
      setClientes([...clientes, response.data]); // Agregar el nuevo cliente a la lista
      setModalCrearClienteVisible(false); // Cerrar el modal
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
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
    <>
      {/* Modal para mostrar la lista de clientes */}
      <CModal visible={visible} onClose={onClose} size="lg">
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

          {/* Tabla de clientes */}
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Tipo de Documento</CTableHeaderCell>
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
                  <CTableDataCell>{cliente.tipoDocumento.nombre}</CTableDataCell>
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