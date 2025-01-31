import React, { useState, useEffect } from 'react';
import {
  CButton,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from '@coreui/react';
import axios from 'axios';

const VentaUI = () => {
  // Estado para el modal de búsqueda de clientes
  const [showClientesModal, setShowClientesModal] = useState(false);

  // Estado para la lista de clientes
  const [clientes, setClientes] = useState([]);

  // Estado para el cliente seleccionado
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Obtener la lista de clientes desde el backend
  useEffect(() => {
    if (showClientesModal) {
      const fetchClientes = async () => {
        try {
          const response = await axios.get('http://localhost:8080/fs/clientes');
          setClientes(response.data);
        } catch (error) {
          console.error('Error al obtener los clientes:', error);
        }
      };

      fetchClientes();
    }
  }, [showClientesModal]);

  // Abrir el modal de búsqueda de clientes
  const handleBuscarCliente = () => {
    setShowClientesModal(true);
  };

  // Seleccionar un cliente y cerrar el modal
  const handleSeleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setShowClientesModal(false);
  };

  // Función para mostrar el tipo de cliente
  const getTipoClienteBadge = (tipoCliente) => {
    switch (tipoCliente) {
      case 'NATURAL':
        return <CBadge color="primary">Natural</CBadge>;
      case 'JURIDICA':
        return <CBadge color="success">Jurídica</CBadge>;
      default:
        return <CBadge color="secondary">Desconocido</CBadge>;
    }
  };

  return (
    <div>
      {/* Campo de búsqueda de cliente */}
      <div className="mb-3">
        <CFormInput
          type="text"
          placeholder="Buscar cliente..."
          value={clienteSeleccionado ? (clienteSeleccionado.tipoCliente === 'NATURAL' ? clienteSeleccionado.nombreCompletoCliente : clienteSeleccionado.razonSocial) : ''}
          readOnly
        />
        <CButton color="primary" onClick={handleBuscarCliente} className="mt-2">
          Buscar Cliente
        </CButton>
      </div>

      {/* Modal para mostrar la lista de clientes */}
      <CModal visible={showClientesModal} onClose={() => setShowClientesModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Seleccionar Cliente</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Tipo</CTableHeaderCell>
                <CTableHeaderCell>Nombre/Razón Social</CTableHeaderCell>
                <CTableHeaderCell>Documento</CTableHeaderCell>
                <CTableHeaderCell>Dirección</CTableHeaderCell>
                <CTableHeaderCell>Teléfono</CTableHeaderCell>
                <CTableHeaderCell>Correo</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {clientes.map((cliente) => (
                <CTableRow key={cliente.idCliente}>
                  <CTableDataCell>{getTipoClienteBadge(cliente.tipoCliente)}</CTableDataCell>
                  <CTableDataCell>
                    {cliente.tipoCliente === 'NATURAL' ? cliente.nombreCompletoCliente : cliente.razonSocial}
                  </CTableDataCell>
                  <CTableDataCell>
                    {cliente.tipoCliente === 'NATURAL' ? cliente.dniCliente : cliente.ruc}
                  </CTableDataCell>
                  <CTableDataCell>{cliente.direccionCliente}</CTableDataCell>
                  <CTableDataCell>{cliente.telefonoCliente}</CTableDataCell>
                  <CTableDataCell>{cliente.correoCliente}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => handleSeleccionarCliente(cliente)}>
                      Seleccionar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowClientesModal(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Resto de la interfaz de ventas */}
      <div>
        <h3>Detalles de la Venta</h3>
        {/* Aquí puedes agregar más campos para la venta */}
      </div>
    </div>
  );
};

export default VentaUI;