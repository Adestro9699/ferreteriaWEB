import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../../services/apiClient';
import './Register.css';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
  CAlert,
  CProgress,
  CProgressBar,
  CCardHeader,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilUser,
  cilLockLocked,
  cilPhone,
  cilEnvelopeOpen,
  cilLocationPin,
  cilBriefcase,
  cilCalendar,
  cilInfo,
  cilPencil,
  cilCheckCircle,
  cilWarning,
} from '@coreui/icons';
import { ferreteriaLogo } from 'src/assets/brand/ferreteria-logo';

const Register = () => {
  // Estados para Trabajador
  const [nombreTrabajador, setNombreTrabajador] = useState('');
  const [apellidoTrabajador, setApellidoTrabajador] = useState('');
  const [dniTrabajador, setDniTrabajador] = useState('');
  const [telefonoTrabajador, setTelefonoTrabajador] = useState('');
  const [correoTrabajador, setCorreoTrabajador] = useState('');
  const [direccionTrabajador, setDireccionTrabajador] = useState('');
  const [cargoTrabajador, setCargoTrabajador] = useState('');
  const [estadoTrabajador, setEstadoTrabajador] = useState('ACTIVO');
  const [fechaIngresoTrabajador, setFechaIngresoTrabajador] = useState('');
  
  // Estados para Usuario
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repiteContrasena, setRepiteContrasena] = useState('');
  
  // Estados para UI/UX
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [tooltips, setTooltips] = useState({
    password: false,
  });

  // Calcular progreso del formulario en tiempo real
  const calculateProgress = useCallback(() => {
    const fieldValidations = {
      nombreTrabajador: nombreTrabajador.trim() !== '',
      apellidoTrabajador: apellidoTrabajador.trim() !== '',
      dniTrabajador: dniTrabajador.trim() !== '',
      telefonoTrabajador: telefonoTrabajador.trim() !== '',
      correoTrabajador: correoTrabajador.trim() !== '',
      direccionTrabajador: direccionTrabajador.trim() !== '',
      cargoTrabajador: cargoTrabajador.trim() !== '',
      fechaIngresoTrabajador: fechaIngresoTrabajador.trim() !== '',
      nombreUsuario: nombreUsuario.trim() !== '',
      contrasena: contrasena.trim() !== '',
      repiteContrasena: repiteContrasena.trim() !== '',
    };
    
    const totalFields = Object.keys(fieldValidations).length;
    const filledFields = Object.values(fieldValidations).filter(Boolean).length;
    const progress = Math.floor((filledFields / totalFields) * 100);
    
    return progress;
  }, [
    nombreTrabajador,
    apellidoTrabajador,
    dniTrabajador,
    telefonoTrabajador,
    correoTrabajador,
    direccionTrabajador,
    cargoTrabajador,
    fechaIngresoTrabajador,
    nombreUsuario,
    contrasena,
    repiteContrasena,
  ]);

  // Helper function to calculate progress with a specific field updated
  const calculateProgressWithUpdate = (fieldName, newValue) => {
    const fieldValues = {
      nombreTrabajador,
      apellidoTrabajador,
      dniTrabajador,
      telefonoTrabajador,
      correoTrabajador,
      direccionTrabajador,
      cargoTrabajador,
      fechaIngresoTrabajador,
      nombreUsuario,
      contrasena,
      repiteContrasena,
    };
    
    // Update the specific field
    fieldValues[fieldName] = newValue;
    
    // Calculate progress with updated values
    const fieldValidations = Object.keys(fieldValues).reduce((acc, key) => {
      acc[key] = fieldValues[key].trim() !== '';
      return acc;
    }, {});
    
    const totalFields = Object.keys(fieldValidations).length;
    const filledFields = Object.values(fieldValidations).filter(Boolean).length;
    return Math.floor((filledFields / totalFields) * 100);
  };

  useEffect(() => {
    setFormProgress(calculateProgress());
  }, [calculateProgress]);

  // Funciones para manejar cambios en los campos con actualización inmediata del progreso
  const updateNombreTrabajador = (e) => {
    const newValue = e.target.value;
    setNombreTrabajador(newValue);
    setFormProgress(calculateProgressWithUpdate('nombreTrabajador', newValue));
  };

  const updateApellidoTrabajador = (e) => {
    const newValue = e.target.value;
    setApellidoTrabajador(newValue);
    setFormProgress(calculateProgressWithUpdate('apellidoTrabajador', newValue));
  };

  const updateDniTrabajador = (e) => {
    const newValue = e.target.value;
    setDniTrabajador(newValue);
    setFormProgress(calculateProgressWithUpdate('dniTrabajador', newValue));
  };

  const updateTelefonoTrabajador = (e) => {
    const newValue = e.target.value;
    setTelefonoTrabajador(newValue);
    setFormProgress(calculateProgressWithUpdate('telefonoTrabajador', newValue));
  };

  const updateCorreoTrabajador = (e) => {
    const newValue = e.target.value;
    setCorreoTrabajador(newValue);
    setFormProgress(calculateProgressWithUpdate('correoTrabajador', newValue));
  };

  const updateDireccionTrabajador = (e) => {
    const newValue = e.target.value;
    setDireccionTrabajador(newValue);
    setFormProgress(calculateProgressWithUpdate('direccionTrabajador', newValue));
  };

  const updateCargoTrabajador = (e) => {
    const newValue = e.target.value;
    setCargoTrabajador(newValue);
    setFormProgress(calculateProgressWithUpdate('cargoTrabajador', newValue));
  };

  const updateEstadoTrabajador = (e) => {
    const newValue = e.target.value;
    setEstadoTrabajador(newValue);
    setFormProgress(calculateProgressWithUpdate('estadoTrabajador', newValue));
  };

  const updateFechaIngresoTrabajador = (e) => {
    const newValue = e.target.value;
    setFechaIngresoTrabajador(newValue);
    setFormProgress(calculateProgressWithUpdate('fechaIngresoTrabajador', newValue));
  };

  const updateNombreUsuario = (e) => {
    const newValue = e.target.value;
    setNombreUsuario(newValue);
    setFormProgress(calculateProgressWithUpdate('nombreUsuario', newValue));
  };

  const updateContrasena = (e) => {
    const newValue = e.target.value;
    setContrasena(newValue);
    setFormProgress(calculateProgressWithUpdate('contrasena', newValue));
  };

  const updateRepiteContrasena = (e) => {
    const newValue = e.target.value;
    setRepiteContrasena(newValue);
    setFormProgress(calculateProgressWithUpdate('repiteContrasena', newValue));
  };

  // Calcular fortaleza de la contraseña
  useEffect(() => {
    if (!contrasena) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Longitud mínima
    if (contrasena.length >= 8) strength += 25;
    
    // Mayúsculas y minúsculas
    if (/[a-z]/.test(contrasena) && /[A-Z]/.test(contrasena)) strength += 25;
    
    // Números
    if (/\d/.test(contrasena)) strength += 25;
    
    // Caracteres especiales
    if (/[^A-Za-z0-9]/.test(contrasena)) strength += 25;
    
    setPasswordStrength(strength);
  }, [contrasena]);

  // UseEffect para generar el nombre de usuario en formato NOMBRE.APELLIDO
  useEffect(() => {
    if (nombreTrabajador && apellidoTrabajador) {
      const primerNombre = nombreTrabajador.split(' ')[0]; // Toma el primer nombre
      const primerApellido = apellidoTrabajador.split(' ')[0]; // Toma el primer apellido
      setNombreUsuario(`${primerNombre.toUpperCase()}.${primerApellido.toUpperCase()}`);
    } else {
      // Si los campos están vacíos, se borra el nombre de usuario
      setNombreUsuario('');
    }
  }, [nombreTrabajador, apellidoTrabajador]);

  // Función para reiniciar estados
  const resetForm = () => {
    setNombreTrabajador('');
    setApellidoTrabajador('');
    setDniTrabajador('');
    setTelefonoTrabajador('');
    setCorreoTrabajador('');
    setDireccionTrabajador('');
    setCargoTrabajador('');
    setEstadoTrabajador('ACTIVO');
    setFechaIngresoTrabajador('');
    setNombreUsuario('');
    setContrasena('');
    setRepiteContrasena('');
    setError('');
    setFormProgress(0);
    setPasswordStrength(0);
    setLoading(false);
  };

  // Función para validar el formulario
  const validarFormulario = () => {
    if (contrasena !== repiteContrasena) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    
    if (passwordStrength < 75) {
      setError('Por favor, utilice una contraseña más segura (incluya mayúsculas, minúsculas, números y símbolos)');
      return false;
    }
    
    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoTrabajador)) {
      setError('Ingrese un correo electrónico válido');
      return false;
    }
    
    // Validar DNI peruano (8 dígitos)
    const dniRegex = /^[0-9]{8}$/;
    if (!dniRegex.test(dniTrabajador)) {
      setError('El DNI debe tener 8 dígitos numéricos');
      return false;
    }
    
    setError('');
    return true;
  };

  // Función para registrar Usuario
  const registrarUsuario = async (idTrabajador) => {
    const nuevoUsuario = {
      nombreUsuario,
      contrasena,
      estadoUsuario: 'ACTIVO',
      fechaCreacion: new Date().toISOString().split('T')[0],
      trabajador: {
        idTrabajador: idTrabajador,
      },
    };
    
    try {
      const response = await apiClient.post('/usuarios', nuevoUsuario);
      return response.data;
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error;
    }
  };

  // Función principal de registro
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Primero registramos el trabajador
      const nuevoTrabajador = {
        nombreTrabajador,
        apellidoTrabajador,
        dniTrabajador,
        telefonoTrabajador,
        correoTrabajador,
        direccionTrabajador,
        cargoTrabajador,
        estadoTrabajador,
        fechaIngresoTrabajador,
      };
      
      const trabajadorResponse = await apiClient.post('/trabajadores', nuevoTrabajador);
      
      // Luego registramos el usuario usando el ID del trabajador
      await registrarUsuario(trabajadorResponse.data.idTrabajador);
      
      setSuccess(true);
      setTimeout(() => {
        resetForm();
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      setError('Error en el proceso de registro. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar el indicador de fortaleza de la contraseña
  const renderPasswordStrengthIndicator = () => {
    let color = 'danger';
    let text = 'Débil';
    
    if (passwordStrength >= 75) {
      color = 'success';
      text = 'Fuerte';
    } else if (passwordStrength >= 50) {
      color = 'warning';
      text = 'Medio';
    }
    
    return (
      <div className="mt-1">
        <CProgress height={5}>
          <CProgressBar color={color} value={passwordStrength} />
        </CProgress>
        <small className="text-muted">{text}</small>
      </div>
    );
  };

  return (
    <div className="register-page d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol lg={10} xl={9}>
            {/* Logo y título en móvil */}
            <div className="text-center mb-4 d-md-none">
              <div className="mb-3" style={{ maxWidth: '100px', margin: '0 auto' }}>
                <div dangerouslySetInnerHTML={{ __html: ferreteriaLogo[1] }} />
              </div>
              <h1 className="register-title">Ferretería SemGar</h1>
              <p className="register-subtitle">Sistema de Gestión</p>
            </div>
            
            <CCard className="register-card">
              <CCardHeader className="register-header d-flex justify-content-between align-items-center">
                {/* Logo en escritorio */}
                <div className="d-none d-md-flex align-items-center">
                  <div style={{ width: '60px', marginRight: '1rem' }}>
                    <div dangerouslySetInnerHTML={{ __html: ferreteriaLogo[1] }} />
                  </div>
                  <div>
                    <h1 className="register-title mb-0">Registro de Personal</h1>
                    <p className="register-subtitle mb-0">Complete el formulario para crear una cuenta</p>
                  </div>
                </div>
                <div className="d-md-none">
                  <h1 className="register-title mb-0">Registro</h1>
                </div>
                <div className="progress-container">
                  <CProgress className="progress">
                    <CProgressBar className="progress-bar" value={formProgress} />
                  </CProgress>
                  <small className="text-white d-block text-center mt-1">{formProgress}% Completado</small>
                </div>
              </CCardHeader>
              
              <CCardBody className="register-body">
                {error && (
                  <CAlert color="danger" className="error-message">
                    {error}
                  </CAlert>
                )}
                
                {success && (
                  <CAlert color="success" className="d-flex align-items-center">
                    <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} />
                    <div>Registro completado con éxito. Será redirigido al login.</div>
                  </CAlert>
                )}
                
                <CForm className="register-form" onSubmit={handleRegister}>
                  <div className="register-section">
                    <h3 className="register-section-title">
                      <CIcon icon={cilUser} className="me-2" />
                      Datos Personales
                    </h3>
                    
                    <div className="form-group-row">
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>
                            <CIcon icon={cilPencil} className="input-icon" />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Nombre"
                            value={nombreTrabajador}
                            onChange={updateNombreTrabajador}
                            required
                            disabled={loading}
                          />
                        </CInputGroup>
                      </div>
                      
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>
                            <CIcon icon={cilPencil} className="input-icon" />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Apellido"
                            value={apellidoTrabajador}
                            onChange={updateApellidoTrabajador}
                            required
                            disabled={loading}
                          />
                        </CInputGroup>
                      </div>
                    </div>
                    
                    <div className="form-group-row">
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>DNI</CInputGroupText>
                          <CFormInput
                            placeholder="12345678"
                            value={dniTrabajador}
                            onChange={updateDniTrabajador}
                            required
                            maxLength={8}
                            disabled={loading}
                          />
                        </CInputGroup>
                      </div>
                      
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>
                            <CIcon icon={cilCalendar} className="input-icon" />
                          </CInputGroupText>
                          <CFormInput
                            type="date"
                            placeholder="Fecha de Ingreso"
                            value={fechaIngresoTrabajador}
                            onChange={updateFechaIngresoTrabajador}
                            required
                            disabled={loading}
                          />
                        </CInputGroup>
                      </div>
                    </div>
                  </div>
                  
                  <div className="register-section">
                    <h3 className="register-section-title">
                      <CIcon icon={cilInfo} className="me-2" />
                      Información de Contacto
                    </h3>
                    
                    <div className="form-group-row">
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>
                            <CIcon icon={cilPhone} className="input-icon" />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Teléfono"
                            value={telefonoTrabajador}
                            onChange={updateTelefonoTrabajador}
                            required
                            disabled={loading}
                          />
                        </CInputGroup>
                      </div>
                      
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>
                            <CIcon icon={cilEnvelopeOpen} className="input-icon" />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Correo Electrónico"
                            type="email"
                            value={correoTrabajador}
                            onChange={updateCorreoTrabajador}
                            required
                            disabled={loading}
                          />
                        </CInputGroup>
                      </div>
                    </div>
                    
                    <div className="form-group-row">
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>
                            <CIcon icon={cilLocationPin} className="input-icon" />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Dirección"
                            value={direccionTrabajador}
                            onChange={updateDireccionTrabajador}
                            required
                            disabled={loading}
                          />
                        </CInputGroup>
                      </div>
                    </div>
                  </div>
                  
                  <div className="register-section">
                    <h3 className="register-section-title">
                      <CIcon icon={cilBriefcase} className="me-2" />
                      Información Laboral
                    </h3>
                    
                    <div className="form-group-row">
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>Cargo</CInputGroupText>
                          <CFormInput
                            placeholder="Cargo"
                            value={cargoTrabajador}
                            onChange={updateCargoTrabajador}
                            required
                            disabled={loading}
                          />
                        </CInputGroup>
                      </div>
                      
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>Estado</CInputGroupText>
                          <CFormSelect
                            value={estadoTrabajador}
                            onChange={updateEstadoTrabajador}
                            disabled={loading}
                          >
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                          </CFormSelect>
                        </CInputGroup>
                      </div>
                    </div>
                    

                  </div>
                  
                  <div className="register-section">
                    <h3 className="register-section-title">
                      <CIcon icon={cilLockLocked} className="me-2" />
                      Datos de Acceso
                    </h3>
                    
                    <div className="form-group-row">
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>
                            <CIcon icon={cilUser} className="input-icon" />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Nombre de Usuario"
                            value={nombreUsuario}
                            onChange={updateNombreUsuario}
                            required
                            disabled={loading}
                          />
                        </CInputGroup>
                      </div>
                    </div>
                    
                    <div className="form-group-row">
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} className="input-icon" />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            placeholder="Contraseña"
                            value={contrasena}
                            onChange={updateContrasena}
                            required
                            disabled={loading}
                          />
                          <CIcon
                            icon={cilInfo}
                            className="field-tooltip"
                            onClick={() => setTooltips({ ...tooltips, password: !tooltips.password })}
                          />
                        </CInputGroup>
                        
                        {tooltips.password && (
                          <div className="password-tooltip mb-2">
                            <small className="text-muted">
                              La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos.
                            </small>
                          </div>
                        )}
                        
                        {contrasena && renderPasswordStrengthIndicator()}
                      </div>
                      
                      <div className="form-group">
                        <CInputGroup className="input-group-register">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} className="input-icon" />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            placeholder="Confirmar Contraseña"
                            value={repiteContrasena}
                            onChange={updateRepiteContrasena}
                            required
                            disabled={loading}
                          />
                        </CInputGroup>
                        
                        {repiteContrasena && contrasena !== repiteContrasena && (
                          <div className="mt-1">
                            <small className="text-danger">
                              <CIcon icon={cilWarning} className="me-1" />
                              Las contraseñas no coinciden
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <CButton 
                      color="primary" 
                      type="submit" 
                      className="register-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner"></span>
                          Registrando...
                        </>
                      ) : (
                        'Registrar Usuario'
                      )}
                    </CButton>
                    
                    <Link to="/login" className="btn btn-link">Volver al Login</Link>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
            
            <div className="login-link mt-3">
              ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;