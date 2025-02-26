import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CForm,
  CInputGroup,
} from '@coreui/react';
import MostrarCliente from './mostrarCliente'; // Importar el componente MostrarCliente

const CompletarVenta = ({ visible, onClose, onSave }) => {
  const [empresa, setEmpresa] = useState('');
  const [cliente, setCliente] = useState('');
  const [tipoComprobante, setTipoComprobante] = useState('');
  const [modalClientesVisible, setModalClientesVisible] = useState(false); // Estado para controlar la visibilidad del modal de clientes
  const fecha = new Date().toISOString().split('T')[0]; // Fecha actual fija

  const handleGuardar = () => {
    const datosComplementarios = {
      empresa,
      cliente,
      tipoComprobante,
      fecha, // Fecha fija que se enviará al backend
    };
    onSave(datosComplementarios); // Guardar los datos en el estado del componente padre
    onClose(); // Cerrar el modal
  };

  const handleAñadirCliente = () => {
    setModalClientesVisible(true); // Abrir el modal de clientes
  };

  const handleSeleccionarCliente = (clienteSeleccionado) => {
    setCliente(clienteSeleccionado.nombre); // Establecer el nombre del cliente seleccionado
    setModalClientesVisible(false); // Cerrar el modal de clientes
  };

  return (
    <>
      {/* Modal principal para completar la venta */}
      <CModal visible={visible} onClose={onClose}>
        <CModalHeader closeButton={false}>
          <CModalTitle>Completar Venta</CModalTitle>
          <div style={{ marginLeft: 'auto' }}>
            <CButton color="secondary" onClick={onClose} style={{ marginRight: '10px' }}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={handleGuardar}>
              Listo
            </CButton>
          </div>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {/* Campo para la empresa */}
            <div className="mb-3">
              <CFormLabel>Empresa</CFormLabel>
              <CFormInput
                type="text"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Ingrese la empresa"
                required
              />
            </div>

            {/* Campo para el cliente con botón "Añadir" */}
            <div className="mb-3">
              <CFormLabel>Cliente</CFormLabel>
              <CInputGroup>
                <CFormInput
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Ingrese el DNI/RUC o NOMBRE/RAZON SOCIAL"
                  required
                />
                <CButton color="primary" onClick={handleAñadirCliente}>
                  Añadir
                </CButton>
              </CInputGroup>
            </div>

            {/* Campo para el tipo de comprobante */}
            <div className="mb-3">
              <CFormLabel>Tipo de Comprobante</CFormLabel>
              <CFormSelect
                value={tipoComprobante}
                onChange={(e) => setTipoComprobante(e.target.value)}
                required
              >
                <option value="">Seleccione un tipo de comprobante</option>
                <option value="factura">Factura</option>
                <option value="boleta">Boleta</option>
                <option value="nota">Nota de Crédito</option>
              </CFormSelect>
            </div>

            {/* Campo para la fecha (fija, no editable) */}
            <div className="mb-3">
              <CFormLabel>Fecha de Venta</CFormLabel>
              <CFormInput
                type="text"
                value={fecha}
                readOnly
              />
            </div>
          </CForm>
        </CModalBody>
      </CModal>

      {/* Modal para mostrar la lista de clientes */}
      <MostrarCliente
        visible={modalClientesVisible}
        onClose={() => setModalClientesVisible(false)}
        onSeleccionarCliente={handleSeleccionarCliente}
      />
    </>
  );
};

export default CompletarVenta;