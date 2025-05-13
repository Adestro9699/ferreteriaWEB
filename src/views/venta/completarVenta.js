import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
  CInputGroup,
  CInputGroupText,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CTooltip,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilX, cilPlus } from '@coreui/icons';
import MostrarCliente from './mostrarCliente';
import apiClient from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const CompletarVenta = ({ visible, onClose, onSave, registrarReinicio, initialData = null }) => {
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
  const [formData, setFormData] = useState({
    idTipoComprobantePago: '',
    idTipoPago: '',
    idEmpresa: '',
    serieComprobante: '',
    numeroComprobante: '',
    fechaVenta: '',
    estadoVenta: 'PENDIENTE',
    observaciones: '',
    moneda: 'SOLES',
  });
  const navigate = useNavigate();

  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDateTime = new Date(now - offset).toISOString().slice(0, 19);
  const fecha = localDateTime;

  const monedas = {
    SOLES: { nombre: 'Soles', simbolo: 'S/' },
    DOLARES: { nombre: 'Dólares', simbolo: '$' }
  };

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
        const response = await apiClient.get('/empresas');
        if (response.data) {
          setEmpresas(response.data);
        }
      } catch (error) {
        console.error('Error al obtener las empresas:', error);
      }
    };

    const fetchTiposComprobante = async () => {
      try {
        const response = await apiClient.get('/tipo-comprobantes-pago');
        if (response.data) {
          setTiposComprobante(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los tipos de comprobante:', error);
      }
    };

    const fetchTiposPago = async () => {
      try {
        const response = await apiClient.get('/tipos-pago');
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

  useEffect(() => {
    if (initialData && empresas.length > 0 && tiposComprobante.length > 0 && tiposPago.length > 0) {
      const empresaSeleccionada = empresas.find(e => e.idEmpresa === initialData.empresaId);
      if (empresaSeleccionada) {
        setEmpresa(empresaSeleccionada);
      }

      const tipoComprobanteSeleccionado = tiposComprobante.find(t => t.idTipoComprobantePago === initialData.tipoComprobanteId);
      if (tipoComprobanteSeleccionado) {
        setTipoComprobante(tipoComprobanteSeleccionado);
      }

      const tipoPagoSeleccionado = tiposPago.find(t => t.idTipoPago === initialData.tipoPagoId);
      if (tipoPagoSeleccionado) {
        setTipoPago(tipoPagoSeleccionado);
      }

      if (initialData.clienteId) {
        apiClient.get(`/clientes/${initialData.clienteId}`)
          .then(response => {
            const cliente = response.data;
            setCliente(cliente);
            setFilterText(
              cliente.tipoDocumento.abreviatura === 'DNI'
                ? `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim()
                : cliente.razonSocial || ''
            );
          })
          .catch(error => {
            console.error("Error al cargar cliente:", error);
            showToast("Error al cargar los datos del cliente", "danger");
          });
      }
    }
  }, [initialData, empresas, tiposComprobante, tiposPago]);

  const handleGuardar = () => {
    if (!empresa || !cliente || !tipoComprobante || !tipoPago) {
      showToast('Por favor, complete todos los campos obligatorios.', 'danger');
      return;
    }

    const datosComplementarios = {
      empresaId: empresa.idEmpresa,
      empresa,
      clienteId: cliente.idCliente,
      cliente,
      tipoComprobanteId: tipoComprobante.idTipoComprobantePago,
      tipoComprobante,
      tipoPagoId: tipoPago.idTipoPago,
      tipoPago,
      trabajadorId: trabajador.idTrabajador,
      trabajador,
      fecha,
      moneda: formData.moneda
    };

    if (typeof onSave === 'function') {
      onSave(datosComplementarios);
    }

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
        if (/^\d+$/.test(value)) {
          try {
            const response = await apiClient.get(`/clientes/buscarPorNumeroDocumento?numeroDocumento=${value}`);
            if (response.data) {
              resultados = Array.isArray(response.data) ? response.data : [response.data];
            }
          } catch (error) {
            console.error('Error al buscar por número de documento:', error);
          }
        } else {
          try {
            // Primero intentar buscar por nombre
            const response = await apiClient.get(`/clientes/buscarPorNombre?nombres=${encodeURIComponent(value)}`);
            if (response.data) {
              resultados = Array.isArray(response.data) ? response.data : [response.data];
            }
          } catch (error) {
            console.error('Error al buscar por nombre:', error);
          }

          // Si no hay resultados, intentar por apellido
          if (resultados.length === 0) {
            try {
              const response = await apiClient.get(`/clientes/buscarPorApellido?apellidos=${encodeURIComponent(value)}`);
              if (response.data) {
                resultados = Array.isArray(response.data) ? response.data : [response.data];
              }
            } catch (error) {
              console.error('Error al buscar por apellido:', error);
            }
          }

          // Si aún no hay resultados, intentar por razón social
          if (resultados.length === 0) {
            try {
              const response = await apiClient.get(`/clientes/buscarPorRazonSocial?razonSocial=${encodeURIComponent(value)}`);
              if (response.data) {
                resultados = Array.isArray(response.data) ? response.data : [response.data];
              }
            } catch (error) {
              console.error('Error al buscar por razón social:', error);
            }
          }
        }
      }

      // Eliminar duplicados
      resultados = Array.from(new Set(resultados.map(c => c.idCliente)))
        .map(id => resultados.find(c => c.idCliente === id));

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

  const handleSubmit = () => {
    if (!empresa || !cliente || !tipoComprobante || !tipoPago) {
      showToast('Por favor, complete todos los campos obligatorios.', 'danger');
      return;
    }

    const datosComplementarios = {
      empresaId: empresa.idEmpresa,
      empresa,
      clienteId: cliente.idCliente,
      cliente,
      tipoComprobanteId: tipoComprobante.idTipoComprobantePago,
      tipoComprobante,
      tipoPagoId: tipoPago.idTipoPago,
      tipoPago,
      trabajadorId: trabajador.idTrabajador,
      trabajador,
      fecha,
      moneda: formData.moneda
    };

    if (typeof onSave === 'function') {
      onSave(datosComplementarios);
    }

    onClose();
  };

  return (
    <>
      <CModal 
        visible={visible} 
        onClose={onClose} 
        size="lg"
        className="modal-dialog-centered"
      >
        <CModalHeader onClose={onClose} className="bg-body-tertiary">
          <CModalTitle className="h5 mb-0">Datos Complementarios de Venta</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          <CForm className="row g-4">
            <div className="col-md-6">
              <CFormLabel className="fw-semibold">Empresa</CFormLabel>
              <CFormSelect
                value={empresa ? empresa.idEmpresa : ''}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value, 10);
                  const selectedEmpresa = empresas.find((emp) => emp.idEmpresa === selectedId);
                  setEmpresa(selectedEmpresa);
                }}
                className="form-select"
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

            <div className="col-md-6">
              <CFormLabel className="fw-semibold">Cliente</CFormLabel>
              <CInputGroup>
                <CTooltip content="Limpiar campo" placement="top">
                  <CButton 
                    color="danger" 
                    onClick={clearSearch} 
                    className="px-3"
                  >
                    <CIcon icon={cilX} />
                  </CButton>
                </CTooltip>
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
                  className="form-control"
                  required
                />
                <CTooltip content="Añadir cliente" placement="top">
                  <CButton 
                    color="primary" 
                    onClick={handleAñadirCliente} 
                    className="px-3"
                  >
                    <CIcon icon={cilPlus} />
                  </CButton>
                </CTooltip>
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

            <div className="col-md-6">
              <CFormLabel className="fw-semibold">Tipo de Comprobante</CFormLabel>
              <CFormSelect
                value={tipoComprobante ? tipoComprobante.idTipoComprobantePago : ''}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value, 10);
                  const selectedTipoComprobante = tiposComprobante.find(
                    (tipo) => tipo.idTipoComprobantePago === selectedId
                  );
                  setTipoComprobante(selectedTipoComprobante);
                }}
                className="form-select"
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

            <div className="col-md-6">
              <CFormLabel className="fw-semibold">Tipo de Pago</CFormLabel>
              <CFormSelect
                value={tipoPago ? tipoPago.idTipoPago : ''}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value, 10);
                  const selectedTipoPago = tiposPago.find((tipo) => tipo.idTipoPago === selectedId);
                  setTipoPago(selectedTipoPago);
                }}
                className="form-select"
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

            <div className="col-md-6">
              <CFormLabel className="fw-semibold">Moneda</CFormLabel>
              <div className="d-flex align-items-center">
                <div className="btn-group" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="moneda"
                    id="monedaSoles"
                    value="SOLES"
                    checked={formData.moneda === 'SOLES'}
                    onChange={(e) => setFormData({...formData, moneda: e.target.value})}
                  />
                  <label className="btn btn-outline-primary" htmlFor="monedaSoles">
                    Soles (S/)
                  </label>
                  <input
                    type="radio"
                    className="btn-check"
                    name="moneda"
                    id="monedaDolares"
                    value="DOLARES"
                    checked={formData.moneda === 'DOLARES'}
                    onChange={(e) => setFormData({...formData, moneda: e.target.value})}
                  />
                  <label className="btn btn-outline-primary" htmlFor="monedaDolares">
                    Dólares ($)
                  </label>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <CFormLabel className="fw-semibold">Fecha de Venta</CFormLabel>
              <CFormInput
                type="text"
                value={new Date(fecha).toLocaleString()}
                readOnly
                className="form-control bg-body-secondary"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter className="bg-body-tertiary p-3">
          <CButton color="secondary" onClick={onClose} className="px-3">
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleSubmit} className="px-3">
            Completar Venta
          </CButton>
        </CModalFooter>
      </CModal>

      <MostrarCliente
        visible={modalClientesVisible}
        onClose={() => setModalClientesVisible(false)}
        onSeleccionarCliente={handleSeleccionarCliente}
      />

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