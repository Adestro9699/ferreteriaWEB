import React, { useState, useEffect } from 'react';
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
  CRow,
  CCol,
} from '@coreui/react';
import apiClient from '../../services/apiClient'; // Importar el cliente API

const CrearCliente = ({ visible, onClose, onGuardar }) => {
  const [nuevoCliente, setNuevoCliente] = useState({
    tipoDocumento: { idTipoDocumento: '', nombre: '', abreviatura: '' }, // Objeto completo
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    razonSocial: '',
    direccion: '',
    telefono: '',
    correo: '',
    consultado: false
  });

  const resetForm = () => {
    setNuevoCliente({
      tipoDocumento: { idTipoDocumento: '', nombre: '', abreviatura: '' },
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      razonSocial: '',
      direccion: '',
      telefono: '',
      correo: '',
      consultado: false
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const [tiposDocumento, setTiposDocumento] = useState([]); // Estado para almacenar los tipos de documento
  const [loading, setLoading] = useState(false); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Obtener los tipos de documento al cargar el componente
  useEffect(() => {
    const fetchTiposDocumento = async () => {
      try {
        const response = await apiClient.get('/fs/tipos-documento');
        // Mapeamos para asegurarnos que tenga abreviatura
        const tiposConAbreviatura = response.data.map(tipo => ({
          ...tipo,
          abreviatura: tipo.nombre.includes('DNI') ? 'DNI' :
            tipo.nombre.includes('RUC') ? 'RUC' :
              tipo.abreviatura || ''
        }));
        setTiposDocumento(tiposConAbreviatura);
      } catch (error) {
        console.error('Error al obtener los tipos de documento:', error);
        setError('Error al cargar los tipos de documento');
      }
    };

    fetchTiposDocumento();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Si está cambiando el número de documento, resetear el estado de consultado
    if (name === 'numeroDocumento') {
      setNuevoCliente(prev => ({
        ...prev,
        [name]: value,
        consultado: false // Resetear el estado de consultado
      }));
    } else {
      setNuevoCliente({ ...nuevoCliente, [name]: value });
    }
  };

  const handleTipoDocumentoChange = (e) => {
    const selectedId = e.target.value;
    const selectedTipoDocumento = tiposDocumento.find(
      (tipo) => tipo.idTipoDocumento === parseInt(selectedId)
    );

    setNuevoCliente({
      ...nuevoCliente,
      tipoDocumento: {
        ...(selectedTipoDocumento || { idTipoDocumento: '', nombre: '', abreviatura: '' }),
        abreviatura: selectedTipoDocumento?.abreviatura.includes('DNI') ? 'DNI' :
          selectedTipoDocumento?.abreviatura.includes('RUC') ? 'RUC' : ''
      },
      consultado: false // Resetear el estado de consultado al cambiar el tipo de documento
    });
  };

  const handleGuardar = async () => {
    setLoading(true); // Activar el estado de carga
    setError(null); // Limpiar errores anteriores

    try {
      // Validar campos obligatorios
      if (!nuevoCliente.tipoDocumento.idTipoDocumento || !nuevoCliente.numeroDocumento) {
        throw new Error('Por favor, complete todos los campos obligatorios.');
      }

      // Validar si el cliente ya existe usando el método buscarPorNumeroDocumento
      const response = await apiClient.get(`/fs/clientes/buscarPorNumeroDocumento?numeroDocumento=${nuevoCliente.numeroDocumento}`);
      if (response.data) {
        throw new Error('El cliente con este número de documento ya existe.');
      }

      // Validaciones condicionales
      if (nuevoCliente.tipoDocumento.nombre === 'RUC' && !nuevoCliente.razonSocial) {
        throw new Error('La razón social es obligatoria para el tipo de documento RUC.');
      }

      if (
        nuevoCliente.tipoDocumento.nombre === 'DNI' &&
        (!nuevoCliente.nombres || !nuevoCliente.apellidos)
      ) {
        throw new Error('Los nombres y apellidos son obligatorios para el tipo de documento DNI.');
      }

      // Preparar los datos para enviar al backend
      const datosCliente = {
        ...nuevoCliente, // Incluye todos los campos, incluso el objeto tipoDocumento
      };

      console.log('Datos enviados al backend:', datosCliente); // Depuración

      // Enviar los datos del nuevo cliente al backend
      const guardarResponse = await apiClient.post('/fs/clientes', datosCliente);

      // Notificar al componente padre que se guardó el cliente
      onGuardar(guardarResponse.data);

      // Cerrar el modal
      onClose();

      // Limpiar el formulario
      setNuevoCliente({
        tipoDocumento: { idTipoDocumento: '', nombre: '' }, // Reiniciamos el objeto
        numeroDocumento: '',
        nombres: '',
        apellidos: '',
        razonSocial: '',
        direccion: '',
        telefono: '',
        correo: '',
      });
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      setError(error.message || 'Error al guardar el cliente');
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  const handleConsultarDocumento = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validar que se haya seleccionado un tipo de documento y se haya ingresado un número
      if (!nuevoCliente.tipoDocumento.idTipoDocumento || !nuevoCliente.numeroDocumento) {
        throw new Error('Seleccione un tipo de documento e ingrese un número para consultar');
      }

      // Verificar que tenemos la abreviatura
      if (!nuevoCliente.tipoDocumento.abreviatura) {
        throw new Error('Tipo de documento no tiene abreviatura configurada');
      }

      // Limpiar los campos que podrían venir de una consulta anterior
      setNuevoCliente(prev => ({
        tipoDocumento: prev.tipoDocumento,
        numeroDocumento: prev.numeroDocumento,
        nombres: '',
        apellidos: '',
        razonSocial: '',
        direccion: '',
        telefono: '',
        correo: '',
        consultado: false // Resetear el estado de consultado
      }));

      const requestBody = {
        numeroDocumento: nuevoCliente.numeroDocumento,
        tipoDocumento: nuevoCliente.tipoDocumento.abreviatura
      };

      console.log('Enviando consulta con:', requestBody);

      const response = await apiClient.post('/fs/consulta', requestBody);

      if (response.data) {
        setNuevoCliente({
          ...response.data,
          tipoDocumento: {
            ...(response.data.tipoDocumento || nuevoCliente.tipoDocumento),
            abreviatura: nuevoCliente.tipoDocumento.abreviatura
          },
          consultado: true // Marcar como ya consultado
        });
        setError('Cliente encontrado. Puede editar los datos si es necesario.');
      } else {
        setError('No se encontró un cliente con este documento. Complete los datos para registrarlo.');
      }
    } catch (error) {
      console.error('Error al consultar el documento:', error);
      setError(error.message || 'Error al consultar el documento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
      <CModalHeader closeButton={false}>
        <CModalTitle>Crear Nuevo Cliente</CModalTitle>
        <div style={{ marginLeft: 'auto' }}>
          <CButton color="secondary" onClick={handleClose} disabled={loading} style={{ marginRight: '10px' }}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleGuardar} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </CButton>
        </div>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {/* Tipo de Documento */}
          <CRow className="mb-3 align-items-center">
            <CCol xs={4}>
              <CFormLabel>
                Tipo de Documento <span className="text-danger">*</span>
              </CFormLabel>
            </CCol>
            <CCol xs={8}>
              <CFormSelect
                name="tipoDocumento"
                value={nuevoCliente.tipoDocumento.idTipoDocumento} // Usamos el id del tipo de documento
                onChange={handleTipoDocumentoChange}
                required
              >
                <option value="">Seleccione un tipo de documento</option>
                {tiposDocumento.map((tipo) => (
                  <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento}> {/* Usamos tipo.idTipoDocumento */}
                    {tipo.abreviatura}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {/* Número de Documento */}
          <CRow className="mb-3 align-items-center">
            <CCol xs={4}>
              <CFormLabel>
                Número de Documento <span className="text-danger">*</span>
              </CFormLabel>
            </CCol>
            <CCol xs={8}>
              <div className="d-flex">
                <CFormInput
                  type="text"
                  name="numeroDocumento"
                  value={nuevoCliente.numeroDocumento}
                  onChange={handleInputChange}
                  placeholder="Ingrese el número de documento"
                  required
                  className="me-2"
                />
                <CButton
                  color="info"
                  onClick={handleConsultarDocumento}
                  disabled={
                    !nuevoCliente.numeroDocumento ||
                    !nuevoCliente.tipoDocumento.idTipoDocumento ||
                    nuevoCliente.consultado ||
                    loading
                  }
                >
                  Consultar
                </CButton>
              </div>
            </CCol>
          </CRow>
          {/* Nombres */}
          <CRow className="mb-3 align-items-center">
            <CCol xs={4}>
              <CFormLabel>
                Nombres {nuevoCliente.tipoDocumento.nombre === 'DNI' && <span className="text-danger">*</span>}
              </CFormLabel>
            </CCol>
            <CCol xs={8}>
              <CFormInput
                type="text"
                name="nombres"
                value={nuevoCliente.nombres}
                onChange={handleInputChange}
                placeholder="Ingrese los nombres"
                required={nuevoCliente.tipoDocumento.nombre === 'DNI'}
              />
            </CCol>
          </CRow>

          {/* Apellidos */}
          <CRow className="mb-3 align-items-center">
            <CCol xs={4}>
              <CFormLabel>
                Apellidos {nuevoCliente.tipoDocumento.nombre === 'DNI' && <span className="text-danger">*</span>}
              </CFormLabel>
            </CCol>
            <CCol xs={8}>
              <CFormInput
                type="text"
                name="apellidos"
                value={nuevoCliente.apellidos}
                onChange={handleInputChange}
                placeholder="Ingrese los apellidos"
                required={nuevoCliente.tipoDocumento.nombre === 'DNI'}
              />
            </CCol>
          </CRow>

          {/* Razón Social */}
          <CRow className="mb-3 align-items-center">
            <CCol xs={4}>
              <CFormLabel>
                Razón Social {nuevoCliente.tipoDocumento.nombre === 'RUC' && <span className="text-danger">*</span>}
              </CFormLabel>
            </CCol>
            <CCol xs={8}>
              <CFormInput
                type="text"
                name="razonSocial"
                value={nuevoCliente.razonSocial}
                onChange={handleInputChange}
                placeholder="Ingrese la razón social"
                required={nuevoCliente.tipoDocumento.nombre === 'RUC'}
              />
            </CCol>
          </CRow>

          {/* Dirección */}
          <CRow className="mb-3 align-items-center">
            <CCol xs={4}>
              <CFormLabel>Dirección</CFormLabel>
            </CCol>
            <CCol xs={8}>
              <CFormInput
                type="text"
                name="direccion"
                value={nuevoCliente.direccion}
                onChange={handleInputChange}
                placeholder="Ingrese la dirección"
              />
            </CCol>
          </CRow>

          {/* Teléfono */}
          <CRow className="mb-3 align-items-center">
            <CCol xs={4}>
              <CFormLabel>Teléfono</CFormLabel>
            </CCol>
            <CCol xs={8}>
              <CFormInput
                type="text"
                name="telefono"
                value={nuevoCliente.telefono}
                onChange={handleInputChange}
                placeholder="Ingrese el teléfono"
              />
            </CCol>
          </CRow>

          {/* Correo */}
          <CRow className="mb-3 align-items-center">
            <CCol xs={4}>
              <CFormLabel>Correo Electrónico</CFormLabel>
            </CCol>
            <CCol xs={8}>
              <CFormInput
                type="email"
                name="correo"
                value={nuevoCliente.correo}
                onChange={handleInputChange}
                placeholder="Ingrese el correo electrónico"
              />
            </CCol>
          </CRow>
        </CForm>

        {/* Leyenda de campos obligatorios */}
        <CRow className="mt-3">
          <CCol>
            <small className="text-muted">
              Los campos marcados con <span className="text-danger">*</span> son obligatorios.
            </small>
          </CCol>
        </CRow>

        {/* Mostrar errores */}
        {error && <div className="text-danger mb-3">{error}</div>}
      </CModalBody>
    </CModal>
  );
};

export default CrearCliente;