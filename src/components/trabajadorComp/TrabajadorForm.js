import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave } from '@coreui/icons';
import apiClient from '../../services/apiClient';

const TrabajadorForm = ({ trabajadorEdit, onSave, onCancel }) => {
  const initialState = {
    nombreTrabajador: '',
    apellidoTrabajador: '',
    dniTrabajador: '',
    telefonoTrabajador: '',
    correoTrabajador: '',
    direccionTrabajador: '',
    cargoTrabajador: '',
    fechaIngresoTrabajador: '',
    estadoTrabajador: 'ACTIVO',
    idSucursal: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarSucursales();
  }, []);

  useEffect(() => {
    if (trabajadorEdit) {
      setFormData({
        ...trabajadorEdit,
        idSucursal: trabajadorEdit.sucursal?.idSucursal || ''
      });
    } else {
      setFormData(initialState);
    }
  }, [trabajadorEdit]);

  const cargarSucursales = async () => {
    try {
      const response = await apiClient.get('/sucursales');
      setSucursales(response.data);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        idSucursal: formData.idSucursal || null
      };

      let response;
      if (trabajadorEdit) {
        // Actualizar trabajador
        response = await apiClient.put(`/trabajadores/${trabajadorEdit.idTrabajador}`, dataToSend);
      } else {
        // Crear nuevo trabajador
        response = await apiClient.post('/trabajadores', dataToSend);
      }
      
      console.log('Trabajador guardado:', response.data);
      onSave();
    } catch (error) {
      console.error('Error al guardar trabajador:', error);
      setError('Error al guardar el trabajador. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CContainer fluid>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">
                  {trabajadorEdit ? 'Editar Trabajador' : 'Nuevo Trabajador'}
                </h4>
                <small className="text-muted">
                  {trabajadorEdit ? 'Modificar información del trabajador' : 'Registrar nuevo trabajador'}
                </small>
              </div>
              <CButton color="secondary" onClick={onCancel}>
                <CIcon icon={cilArrowLeft} className="me-2" />
                Volver
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <CRow>
                  {/* Información Personal */}
                  <CCol md={6}>
                    <h5 className="mb-3">Información Personal</h5>
                    
                    <div className="mb-3">
                      <CFormLabel htmlFor="nombreTrabajador">Nombre *</CFormLabel>
                      <CFormInput
                        id="nombreTrabajador"
                        name="nombreTrabajador"
                        value={formData.nombreTrabajador}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="apellidoTrabajador">Apellido *</CFormLabel>
                      <CFormInput
                        id="apellidoTrabajador"
                        name="apellidoTrabajador"
                        value={formData.apellidoTrabajador}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="dniTrabajador">DNI *</CFormLabel>
                      <CFormInput
                        id="dniTrabajador"
                        name="dniTrabajador"
                        value={formData.dniTrabajador}
                        onChange={handleChange}
                        required
                        maxLength="8"
                      />
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="telefonoTrabajador">Teléfono *</CFormLabel>
                      <CFormInput
                        id="telefonoTrabajador"
                        name="telefonoTrabajador"
                        value={formData.telefonoTrabajador}
                        onChange={handleChange}
                        required
                        type="tel"
                      />
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="correoTrabajador">Correo Electrónico</CFormLabel>
                      <CFormInput
                        id="correoTrabajador"
                        name="correoTrabajador"
                        value={formData.correoTrabajador}
                        onChange={handleChange}
                        type="email"
                      />
                    </div>
                  </CCol>

                  {/* Información Laboral */}
                  <CCol md={6}>
                    <h5 className="mb-3">Información Laboral</h5>
                    
                    <div className="mb-3">
                      <CFormLabel htmlFor="cargoTrabajador">Cargo *</CFormLabel>
                      <CFormInput
                        id="cargoTrabajador"
                        name="cargoTrabajador"
                        value={formData.cargoTrabajador}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="fechaIngresoTrabajador">Fecha de Ingreso *</CFormLabel>
                      <CFormInput
                        id="fechaIngresoTrabajador"
                        name="fechaIngresoTrabajador"
                        value={formData.fechaIngresoTrabajador}
                        onChange={handleChange}
                        type="date"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="estadoTrabajador">Estado *</CFormLabel>
                      <CFormSelect
                        id="estadoTrabajador"
                        name="estadoTrabajador"
                        value={formData.estadoTrabajador}
                        onChange={handleChange}
                        required
                      >
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                      </CFormSelect>
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="idSucursal">Sucursal</CFormLabel>
                      <CFormSelect
                        id="idSucursal"
                        name="idSucursal"
                        value={formData.idSucursal}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione una sucursal</option>
                        {sucursales.map(sucursal => (
                          <option key={sucursal.idSucursal} value={sucursal.idSucursal}>
                            {sucursal.nombre} - {sucursal.direccion}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>

                {/* Dirección */}
                <CRow>
                  <CCol xs={12}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="direccionTrabajador">Dirección</CFormLabel>
                      <CFormTextarea
                        id="direccionTrabajador"
                        name="direccionTrabajador"
                        value={formData.direccionTrabajador}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                  </CCol>
                </CRow>

                {/* Botones */}
                <CRow>
                  <CCol xs={12} className="d-flex justify-content-end">
                    <CButton
                      color="secondary"
                      className="me-2"
                      onClick={onCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </CButton>
                    <CButton
                      color="primary"
                      type="submit"
                      disabled={loading}
                    >
                      <CIcon icon={cilSave} className="me-2" />
                      {loading ? 'Guardando...' : (trabajadorEdit ? 'Actualizar' : 'Guardar')}
                    </CButton>
                  </CCol>
                </CRow>

                {error && (
                  <CRow>
                    <CCol xs={12}>
                      <div className="alert alert-danger mt-3">
                        {error}
                      </div>
                    </CCol>
                  </CRow>
                )}
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default TrabajadorForm; 