import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Importar useSelector
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
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import MostrarCliente from './mostrarCliente';
import apiClient from '../../services/apiClient';

const CompletarVenta = ({ visible, onClose, onSave }) => {
  const trabajador = useSelector((state) => state.auth.trabajador); // Obtener el trabajador desde Redux
  const [empresa, setEmpresa] = useState(null); // Cambiar a null para almacenar el objeto completo
  const [empresas, setEmpresas] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [tipoComprobante, setTipoComprobante] = useState(null); // Almacenar el objeto completo
  const [tiposComprobante, setTiposComprobante] = useState([]); // Lista de tipos de comprobante
  const [tipoPago, setTipoPago] = useState(null); // Almacenar el objeto completo del tipo de pago
  const [tiposPago, setTiposPago] = useState([]); // Lista de tipos de pago
  const [modalClientesVisible, setModalClientesVisible] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  // Obtener la fecha y hora actual en formato LocalDateTime (YYYY-MM-DDTHH:mm:ss)
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // Obtener el offset en milisegundos
  const localDateTime = new Date(now - offset).toISOString().slice(0, 19); // Formato: YYYY-MM-DDTHH:mm:ss
  const fecha = localDateTime;

  // Obtener las empresas, tipos de comprobante y tipos de pago al montar el componente
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
    const datosComplementarios = {
      empresaId: empresa ? empresa.idEmpresa : null, // Solo el ID de la empresa
      clienteId: cliente ? cliente.idCliente : null, // Solo el ID del cliente
      tipoComprobanteId: tipoComprobante ? tipoComprobante.idTipoComprobantePago : null, // Solo el ID del tipo de comprobante
      tipoPagoId: tipoPago ? tipoPago.idTipoPago : null, // Solo el ID del tipo de pago
      trabajadorId: trabajador ? trabajador.idTrabajador : null, // Solo el ID del trabajador
      fecha,
    };
    onSave(datosComplementarios); // Pasar los datos al componente padre
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

      setResultadosBusqueda(resultados);
    } catch (error) {
      console.error('Error al buscar los datos:', error);
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
              <CFormSelect
                value={empresa ? empresa.idEmpresa : ''} // Mostrar el idEmpresa como valor seleccionado
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value, 10); // Convertir a número
                  const selectedEmpresa = empresas.find(
                    (emp) => emp.idEmpresa === selectedId
                );
                  setEmpresa(selectedEmpresa); // Almacenar el objeto completo de la empresa
                }}
                required
              >
                <option value="">Seleccione una empresa</option>
                {
                empresas.map((empresa) => (
                  <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                    {empresa.razonSocial} {/* Mostrar la razón social de la empresa */}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {/* Campo para el cliente con botón "Añadir" */}
            <div className="mb-3">
              <CFormLabel>Cliente</CFormLabel>
              <CInputGroup>
                {/* Botón para borrar (a la izquierda) */}
                <CInputGroupText>
                  <CButton color="light" onClick={clearSearch}>
                    <CIcon icon={cilX} />
                  </CButton>
                </CInputGroupText>
                {/* Campo de búsqueda */}
                <CFormInput
                  type="text"
                  value={
                    cliente
                      ? cliente.tipoDocumento.nombre === 'DNI'
                        ? `${cliente.nombres} ${cliente.apellidos}`
                        : cliente.razonSocial
                      : filterText
                  }
                  onChange={(e) => {
                    setFilterText(e.target.value);
                    handleBuscarCliente(e.target.value);
                  }}
                  placeholder="DNI/RUC o NOMBRE/RAZON SOCIAL"
                  required
                />
                {/* Botón para añadir (a la derecha) */}
                <CButton color="primary" onClick={handleAñadirCliente}>
                  Añadir
                </CButton>
              </CInputGroup>
              {/* Mostrar resultados de la búsqueda */}
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
                        {cliente.tipoDocumento.nombre === 'DNI'
                          ? `${cliente.nombres} ${cliente.apellidos}`
                          : cliente.razonSocial}
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
                value={tipoComprobante ? tipoComprobante.idTipoComprobantePago : ''} // Usar idTipoComprobantePago
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value, 10); // Convertir a número
                  const selectedTipoComprobante = tiposComprobante.find(
                    (tipo) => tipo.idTipoComprobantePago === selectedId // Usar idTipoComprobantePago
                  );
                  setTipoComprobante(selectedTipoComprobante);
                }}
                required
              >
                <option value="">Seleccione un tipo de comprobante</option>
                {tiposComprobante.map((tipo) => (
                  <option key={tipo.idTipoComprobantePago} value={tipo.idTipoComprobantePago}> {/* Usar idTipoComprobantePago */}
                    {tipo.nombre}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {/* Campo para el tipo de pago */}
            <div className="mb-3">
              <CFormLabel>Tipo de Pago</CFormLabel>
              <CFormSelect
                value={tipoPago ? tipoPago.idTipoPago : ''} // Usar idTipoPago
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value, 10); // Convertir a número
                  const selectedTipoPago = tiposPago.find(
                    (tipo) => tipo.idTipoPago === selectedId // Usar idTipoPago
                  );
                  setTipoPago(selectedTipoPago);
                }}
                required
              >
                <option value="">Seleccione un tipo de pago</option>
                {tiposPago.map((tipo) => (
                  <option key={tipo.idTipoPago} value={tipo.idTipoPago}> {/* Usar idTipoPago */}
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
                value={new Date(fecha).toLocaleString()} // Mostrar la fecha y hora en formato local
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