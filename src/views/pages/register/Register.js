import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilCalendar } from '@coreui/icons'

const Register = () => {
  // Estados para Trabajador
  const [nombreTrabajador, setNombreTrabajador] = useState('')
  const [apellidoTrabajador, setApellidoTrabajador] = useState('')
  const [dniTrabajador, setDniTrabajador] = useState('')
  const [telefonoTrabajador, setTelefonoTrabajador] = useState('')
  const [correoTrabajador, setCorreoTrabajador] = useState('')
  const [direccionTrabajador, setDireccionTrabajador] = useState('')
  const [cargoTrabajador, setCargoTrabajador] = useState('')
  const [estadoTrabajador, setEstadoTrabajador] = useState('ACTIVO')
  const [fechaIngresoTrabajador, setFechaIngresoTrabajador] = useState('')

  // Estados para Usuario
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [repiteContrasena, setRepiteContrasena] = useState('')
  
  // Estado para manejar errores
  const [error, setError] = useState('')

  // Función para reiniciar estados
  const resetForm = () => {
    setNombreTrabajador('')
    setApellidoTrabajador('')
    setDniTrabajador('')
    setTelefonoTrabajador('')
    setCorreoTrabajador('')
    setDireccionTrabajador('')
    setCargoTrabajador('')
    setEstadoTrabajador('ACTIVO')
    setFechaIngresoTrabajador('')
    setNombreUsuario('')
    setContrasena('')
    setRepiteContrasena('')
    setError('')
  }

  // Función para validar el formulario
  const validarFormulario = () => {
    if (contrasena !== repiteContrasena) {
      setError('Las contraseñas no coinciden')
      return false
    }
    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return false
    }
    setError('')
    return true
  }

  // Función para registrar Usuario
  const registrarUsuario = async (idTrabajador) => {
    const nuevoUsuario = {
      nombreUsuario,
      contrasena,
      estadoUsuario: 'ACTIVO',
      fechaCreacion: new Date().toISOString().split('T')[0],
      trabajador: {
        idTrabajador: idTrabajador
      }
    }

    try {
      const response = await axios.post('http://localhost:8080/fs/usuarios', nuevoUsuario)
      console.log('Usuario registrado:', response.data)
      return response.data
    } catch (error) {
      console.error('Error al registrar el usuario:', error)
      throw error
    }
  }

  // Función principal de registro
  const handleRegister = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

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
      }

      const trabajadorResponse = await axios.post(
        'http://localhost:8080/fs/trabajadores',
        nuevoTrabajador
      )
      console.log('Trabajador registrado:', trabajadorResponse.data)

      // Luego registramos el usuario usando el ID del trabajador
      const usuarioResponse = await registrarUsuario(trabajadorResponse.data.idTrabajador)
      console.log('Proceso completo exitoso:', usuarioResponse)

      alert('Registro completado con éxito')
      resetForm()
    } catch (error) {
      console.error('Error en el proceso de registro:', error)
      setError('Error en el proceso de registro. Por favor, intente nuevamente.')
    }
  }

  // UseEffect para generar el nombre de usuario en formato NOMBRE.APELLIDO
  useEffect(() => { 
    if (nombreTrabajador && apellidoTrabajador) {
      const primerNombre = nombreTrabajador.split(' ')[0]; // Toma el primer nombre
      const primerApellido = apellidoTrabajador.split(' ')[0]; // Toma el primer apellido
      setNombreUsuario(
        `${primerNombre.toUpperCase()}.${primerApellido.toUpperCase()}`
      );
    } else {
      // Si los campos están vacíos, se borra el nombre de usuario
      setNombreUsuario('');
    }
  }, [nombreTrabajador, apellidoTrabajador]);  

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
                  <h1>Registrar Trabajador y Usuario</h1>
                  <p className="text-body-secondary">Complete todos los datos</p>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Campos del Trabajador */}
                  <h4 className="mb-3">Datos del Trabajador</h4>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Nombre"
                      value={nombreTrabajador}
                      onChange={(e) => setNombreTrabajador(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Apellido"
                      value={apellidoTrabajador}
                      onChange={(e) => setApellidoTrabajador(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>DNI</CInputGroupText>
                    <CFormInput
                      placeholder="DNI"
                      value={dniTrabajador}
                      onChange={(e) => setDniTrabajador(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Teléfono</CInputGroupText>
                    <CFormInput
                      placeholder="Teléfono"
                      value={telefonoTrabajador}
                      onChange={(e) => setTelefonoTrabajador(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Correo</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Correo Electrónico"
                      value={correoTrabajador}
                      onChange={(e) => setCorreoTrabajador(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Dirección</CInputGroupText>
                    <CFormInput
                      placeholder="Dirección"
                      value={direccionTrabajador}
                      onChange={(e) => setDireccionTrabajador(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Cargo</CInputGroupText>
                    <CFormInput
                      placeholder="Cargo"
                      value={cargoTrabajador}
                      onChange={(e) => setCargoTrabajador(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Estado</CInputGroupText>
                    <CFormSelect
                      value={estadoTrabajador}
                      onChange={(e) => setEstadoTrabajador(e.target.value)}
                    >
                      <option value="ACTIVO">ACTIVO</option>
                      <option value="INACTIVO">INACTIVO</option>
                    </CFormSelect>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Fecha de Ingreso</CInputGroupText>
                    <CFormInput
                      type="date"
                      value={fechaIngresoTrabajador}
                      onChange={(e) => setFechaIngresoTrabajador(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  {/* Campos del Usuario */}
                  <h4 className="mb-3">Datos del Usuario</h4>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Nombre de Usuario"
                      value={nombreUsuario}
                      onChange={(e) => setNombreUsuario(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repetir contraseña"
                      value={repiteContrasena}
                      onChange={(e) => setRepiteContrasena(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Registrar
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
