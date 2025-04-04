import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  CInputGroupText,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import MostrarCliente from './mostrarCliente';
import apiClient from '../../services/apiClient';

const CompletarVenta = ({ visible, onClose, onSave, registrarReinicio }) => {
  const trabajador = useSelector((state) => state.auth.trabajador);
  const [empresa, setEmpresa] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [tipoComprobante, setTipoComprobante] = useState(null);
  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [tipoPago, setTipoPago] = useState(null);
  const [tiposPago, setTiposPago] = useState([]);
  const [modalClientesVisible, setModalClientesVisible] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '', color: 'danger' });

  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDateTime = new Date(now - offset).toISOString().slice(0, 19);
  const fecha = localDateTime;

  const showToast = (message, color = 'danger') => {
    setToast({ visible: true, message, color });
    setTimeout(() => {
      setToast({ visible: false, message: '', color: 'danger' });
    }, 3000);
  };

  const reiniciarEstado = () => {
    setEmpresa(null);
    setCliente(null);
    setTipoComprobante(null);
    setTipoPago(null);
    setFilterText('');
    setResultadosBusqueda([]);
  };

  useEffect(() => {
    if (registrarReinicio) {
      registrarReinicio(reiniciarEstado);
    }
  }, []);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await apiClient.get('/fs/empresas');
        if (response.data) {
          setEmpresas(response.data);
        }
      } catch (error) {
        console.error('Error al obtener las empresas:', error);
      }
    };

    const fetchTiposComprobante = async () => {
      try {
        const response = await apiClient.get('/fs/tipo-comprobantes-pago');
        if (response.data) {
          setTiposComprobante(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los tipos de comprobante:', error);
      }
    };

    const fetchTiposPago = async () => {
      try {
        const response = await apiClient.get('/fs/tipos-pago');
        if (response.data) {
          setTiposPago(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los tipos de pago:', error);
      }
    };

    fetchEmpresas();
    fetchTiposComprobante();
    fetchTiposPago();
  }, []);

  const handleGuardar = () => {
    if (!empresa || !cliente || !tipoComprobante || !tipoPago) {
      showToast('Por favor, complete todos los campos obligatorios.', 'danger');
      return;
    }

    const datosComplementarios = {
      empresaId: empresa.idEmpresa,
      clienteId: cliente.idCliente,
      tipoComprobanteId: tipoComprobante.idTipoComprobantePago,
      tipoPagoId: tipoPago.idTipoPago,
      trabajadorId: trabajador.idTrabajador,
      fecha,
    };

    onSave(datosComplementarios);
    onClose();
  };

  const handleAñadirCliente = () => {
    setModalClientesVisible(true);
  };

  const handleSeleccionarCliente = (clienteSeleccionado) => {
    setCliente(clienteSeleccionado);
    setModalClientesVisible(false);
  };

  const handleBuscarCliente = async (value) => {
    setFilterText(value);

    try {
      let resultados = [];

      if (value.length > 0) {
        // Búsqueda por número de documento (DNI o RUC)
        if (/^\d+$/.test(value)) {
          const response = await apiClient.get(`/fs/clientes/buscarPorNumeroDocumento?numeroDocumento=${value}`);
          if (response.data) {
            resultados = Array.isArray(response.data) ? response.data : [response.data];
          }
        }
        // Búsqueda por texto (nombres, apellidos o razón social)
        else {
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

          // Eliminar duplicados
          resultados = Array.from(new Set(resultados.map(c => c.idCliente)))
            .map(id => resultados.find(c => c.idCliente === id));
        }
      }

      setResultadosBusqueda(resultados);
    } catch (error) {
      console.error('Error al buscar los datos:', error);
      setResultadosBusqueda([]);
    }
  };

  const clearSearch = () => {
    setCliente(null);
    setFilterText('');
    setResultadosBusqueda([]);
  };

  return (
    <>
      {/* Modal principal para completar la venta */}
      <CModal visible={visible} onClose={onClose} backdrop="static">
        <CModalHeader closeButton={false}>
          <CModalTitle>Datos Venta</CModalTitle>
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
              <CFormSelect
                value={empresa ? empresa.idEmpresa : ''}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value, 10);
                  const selectedEmpresa = empresas.find((emp) => emp.idEmpresa === selectedId);
                  setEmpresa(selectedEmpresa);
                }}
                required
              >
                <option value="">Seleccione una empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                    {empresa.razonSocial}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {/* Campo para el cliente con botón "Añadir" */}
            <div className="mb-3">
              <CFormLabel>Cliente</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CButton color="light" onClick={clearSearch}>
                    <CIcon icon={cilX} />
                  </CButton>
                </CInputGroupText>
                <CFormInput
                  type="text"
                  value={
                    cliente
                      ? cliente.tipoDocumento.abreviatura === 'DNI'
                        ? `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim()
                        : cliente.razonSocial || ''
                      : filterText
                  }
                  onChange={(e) => {
                    setFilterText(e.target.value);
                    handleBuscarCliente(e.target.value);
                  }}
                  placeholder="DNI/RUC o NOMBRE/RAZON SOCIAL"
                  required
                />
                <CButton color="primary" onClick={handleAñadirCliente}>
                  Añadir
                </CButton>
              </CInputGroup>
              {resultadosBusqueda.length > 0 && (
                <div className="mt-2">
                  <ul className="list-group">
                    {resultadosBusqueda.map((cliente) => (
                      <li
                        key={cliente.idCliente}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setCliente(cliente);
                          setResultadosBusqueda([]);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {cliente.tipoDocumento.abreviatura === 'DNI'
                          ? `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim()
                          : cliente.razonSocial || ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Campo para el tipo de comprobante */}
            <div className="mb-3">
              <CFormLabel>Tipo de Comprobante</CFormLabel>
              <CFormSelect
                value={tipoComprobante ? tipoComprobante.idTipoComprobantePago : ''}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value, 10);
                  const selectedTipoComprobante = tiposComprobante.find(
                    (tipo) => tipo.idTipoComprobantePago === selectedId
                  );
                  setTipoComprobante(selectedTipoComprobante);
                }}
                required
              >
                <option value="">Seleccione un tipo de comprobante</option>
                {tiposComprobante.map((tipo) => (
                  <option key={tipo.idTipoComprobantePago} value={tipo.idTipoComprobantePago}>
                    {tipo.nombre}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {/* Campo para el tipo de pago */}
            <div className="mb-3">
              <CFormLabel>Tipo de Pago</CFormLabel>
              <CFormSelect
                value={tipoPago ? tipoPago.idTipoPago : ''}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value, 10);
                  const selectedTipoPago = tiposPago.find((tipo) => tipo.idTipoPago === selectedId);
                  setTipoPago(selectedTipoPago);
                }}
                required
              >
                <option value="">Seleccione un tipo de pago</option>
                {tiposPago.map((tipo) => (
                  <option key={tipo.idTipoPago} value={tipo.idTipoPago}>
                    {tipo.nombre}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {/* Campo para la fecha (fija, no editable) */}
            <div className="mb-3">
              <CFormLabel>Fecha de Venta</CFormLabel>
              <CFormInput
                type="text"
                value={new Date(fecha).toLocaleString()}
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

      {/* Toast para mostrar mensajes de error */}
      <CToaster placement="top-center">
        {toast.visible && (
          <CToast autohide={true} visible={toast.visible} color={toast.color}>
            <CToastHeader closeButton>
              <strong className="me-auto">Aviso</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>
    </>
  );
};

export default CompletarVenta;