import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CContainer, CButton, CCard, CCardBody, CCardText, CCardTitle, CModal, CModalHeader, CModalBody, CModalFooter, CToast, CToastBody, CToastHeader } from '@coreui/react';
import apiClient from '../../services/apiClient';
import { cilPencil } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';

const Caja = () => {
  const dispatch = useDispatch();
  // Estado para almacenar las cajas creadas
  const [cajas, setCajas] = useState([]);
  // Estado para controlar el modal de confirmación de cierre
  const [modalCerrarVisible, setModalCerrarVisible] = useState(false);
  // Estado para controlar el modal de confirmación de eliminación
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  // Estado para guardar el índice de la caja que se va a cerrar o eliminar
  const [cajaACerrarIndex, setCajaACerrarIndex] = useState(null);
  const [cajaAEliminarIndex, setCajaAEliminarIndex] = useState(null);
  // Estado para controlar la visibilidad y contenido de los toasts
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' o 'danger'

  // Referencias para manejar el foco
  const mainContainerRef = useRef(null);
  const eliminarButtonRef = useRef(null);
  const cerrarButtonRef = useRef(null);

  // Obtenemos el usuario actual desde el estado de Redux
  const usuarioActual = useSelector(state => state.auth.user);
  console.log("Usuario actual desde Redux:", usuarioActual);

  const obtenerCajas = async () => {
    try {
      const response = await apiClient.get('/cajas');
      if (response.data) {
        console.log("Estructura completa de las cajas:", response.data);
        response.data.forEach((caja, index) => {
          console.log(`Caja ${index} - ID:`, caja.idCaja, "Tipo:", typeof caja.idCaja);
        });
        setCajas(response.data);
      }
    } catch (error) {
      console.error('Error al obtener las cajas:', error);
    }
  };

  useEffect(() => {
    obtenerCajas();
    console.log("Estructura completa de usuarioActual:", usuarioActual);
  }, []);

  // Efecto para ocultar el toast después de 3 segundos
  useEffect(() => {
    let timer;
    if (toastVisible) {
      timer = setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [toastVisible]);

  const handleCrearCaja = async () => {
    const nombreCaja = prompt('Ingrese el nombre de la caja:');
    if (!nombreCaja) return;

    const nuevaCaja = {
      nombreCaja,
      fechaApertura: null,
      fechaClausura: null,
      saldoInicial: null,
      entradas: null,
      salidas: null,
      saldoFinal: null,
      observaciones: null,
      estado: 'CERRADA',
    };

    try {
      const response = await apiClient.post('/cajas', nuevaCaja);
      if (response.data) {
        setCajas([...cajas, response.data]);
      }
    } catch (error) {
      console.error('Error al crear la caja:', error);
    }
  };

  // Función para mostrar el modal de confirmación de eliminación
  const mostrarConfirmacionEliminar = (index) => {
    setCajaAEliminarIndex(index);
    setModalEliminarVisible(true);
  };

  // Función para confirmar la eliminación de la caja
  const confirmarEliminarCaja = async () => {
    const index = cajaAEliminarIndex;
    const cajaId = cajas[index].idCaja;
    console.log("ID de la caja a eliminar:", cajaId);

    try {
      await apiClient.delete(`/cajas/${cajaId}`);

      // Actualizar la lista de cajas
      const nuevasCajas = cajas.filter((_, i) => i !== index);
      setCajas(nuevasCajas);

      // Mostrar toast de éxito
      setToastMessage('Eliminación exitosa');
      setToastType('success');
      setToastVisible(true);

    } catch (error) {
      console.error('Error al eliminar la caja:', error);

      // Verificar si el error es debido a registros relacionados
      if (error.response && error.response.status === 400) {
        setToastMessage('No se puede eliminar esta caja porque tiene registros relacionados');
      } else {
        setToastMessage('Error al eliminar la caja');
      }

      setToastType('danger');
      setToastVisible(true);
    } finally {
      // Cerrar el modal de confirmación y devolver el foco al contenedor principal
      setModalEliminarVisible(false);
      setTimeout(() => {
        if (mainContainerRef.current) {
          mainContainerRef.current.focus();
        }
      }, 50);
    }
  };

  const handleEditarCaja = async (index) => {
    const nuevoNombre = prompt('Ingrese el nuevo nombre de la caja:', cajas[index].nombreCaja);
    if (nuevoNombre) {
      const cajaId = cajas[index].idCaja;
      console.log("ID de la caja a editar:", cajaId);

      // Crear un objeto con todos los campos de la caja, actualizando solo el nombre
      const cajaActualizada = {
        ...cajas[index], // Copia todos los campos de la caja actual
        nombreCaja: nuevoNombre, // Actualiza solo el nombre
      };

      try {
        // Enviar la caja actualizada al backend
        await apiClient.put(`/cajas/${cajaId}`, cajaActualizada);

        // Actualizar el estado local de las cajas
        const nuevasCajas = [...cajas];
        nuevasCajas[index].nombreCaja = nuevoNombre;
        setCajas(nuevasCajas);

        // Mostrar toast de éxito
        setToastMessage('Nombre de la caja actualizado exitosamente');
        setToastType('success');
        setToastVisible(true);
      } catch (error) {
        console.error('Error al editar la caja:', error);

        // Mostrar toast de error
        setToastMessage('Error al actualizar el nombre de la caja');
        setToastType('danger');
        setToastVisible(true);
      }
    }
  };

  const handleAbrirCaja = async (index) => {
    if (!cajas[index] || !cajas[index].idCaja) {
      console.error("Error: Caja no encontrada o ID no válido", cajas[index]);
      return;
    }

    const cajaId = cajas[index].idCaja;
    console.log("ID de la caja a abrir:", cajaId);

    if (!usuarioActual || !usuarioActual.idUsuario) {
      console.error("Error: Usuario no encontrado o ID no válido", usuarioActual);
      return;
    }

    const usuarioId = usuarioActual.idUsuario;
    console.log("ID del usuario que abre la caja:", usuarioId);

    const saldoInicialStr = prompt('Ingrese el saldo inicial de la caja:');

    if (saldoInicialStr === null || saldoInicialStr.trim() === '') {
      return;
    }

    const saldoInicial = parseFloat(saldoInicialStr);

    if (isNaN(saldoInicial)) {
      alert('Por favor ingrese un valor numérico válido');
      return;
    }

    const datosApertura = {
      idCaja: Number(cajaId),
      idUsuario: Number(usuarioId),
      saldoInicial: saldoInicial,
    };

    console.log("Datos enviados para abrir la caja:", datosApertura);

    try {
      const response = await apiClient.post('/cajas/abrir', datosApertura);
      console.log("Respuesta del backend al abrir la caja:", response.data);

      // Despachar la acción para guardar el idCaja en el estado global
      dispatch({
        type: 'ABRIR_CAJA',
        payload: {
          idCaja: Number(cajaId),
        },
      });

      // Imprimir el idCaja desde el estado global
      console.log("idCaja capturado en el estado global:", cajaId);
      const idCaja = localStorage.getItem('idCaja');
      console.log(idCaja);

      // Actualizar el estado local
      const nuevasCajas = [...cajas];
      nuevasCajas[index].estado = 'ABIERTA';
      setCajas(nuevasCajas);

      // Mostrar toast de éxito
      setToastMessage('Caja abierta exitosamente');
      setToastType('success');
      setToastVisible(true);

      // Refrescar la lista de cajas
      obtenerCajas();
    } catch (error) {
      console.error('Error al abrir la caja:', error);

      // Verificar si el error es debido a que el usuario ya tiene una caja abierta
      if (error.response && error.response.status === 409) {
        setToastMessage(error.response.data.message || 'No puedes abrir otra caja porque ya tienes una abierta.');
      } else {
        setToastMessage('Error al abrir la caja.');
      }

      setToastType('danger');
      setToastVisible(true);
    }
  };

  // Función para mostrar el modal de confirmación de cierre
  const mostrarConfirmacionCierre = (index) => {
    setCajaACerrarIndex(index);
    setModalCerrarVisible(true);
  };

  // Función para confirmar el cierre de la caja
  const confirmarCerrarCaja = async () => {
    const index = cajaACerrarIndex;

    if (!cajas[index] || !cajas[index].idCaja) {
      console.error("Error: Caja no encontrada o ID no válido", cajas[index]);
      setModalCerrarVisible(false);
      return;
    }

    const cajaId = cajas[index].idCaja;
    console.log("ID de la caja a cerrar:", cajaId);

    if (!usuarioActual || !usuarioActual.idUsuario) {
      console.error("Error: Usuario no encontrado o ID no válido", usuarioActual);
      setModalCerrarVisible(false);
      return;
    }

    const usuarioId = usuarioActual.idUsuario;
    console.log("ID del usuario que cierra la caja:", usuarioId);

    const datosCierre = {
      idCaja: Number(cajaId),
      idUsuario: Number(usuarioId),
    };

    console.log("Datos enviados para cerrar la caja:", datosCierre);

    try {
      const response = await apiClient.post('/cajas/cerrar', datosCierre);
      console.log("Respuesta del backend al cerrar la caja:", response.data);

      // Despachar la acción para eliminar el idCaja del estado global
      dispatch({ type: 'CERRAR_CAJA' });

      // Actualizar el estado local
      const nuevasCajas = [...cajas];
      nuevasCajas[index].estado = 'CERRADA';
      setCajas(nuevasCajas);

      // Cerrar el modal
      setModalCerrarVisible(false);
      setToastMessage('Cierre de caja realizado con éxito');
      setToastType('success');
      setToastVisible(true);

      // Refrescar la lista de cajas
      obtenerCajas();
    } catch (error) {
      console.error('Error al cerrar la caja:', error);
    }
  };

  // Función para cerrar modal y restaurar foco
  const handleCloseEliminarModal = () => {
    setModalEliminarVisible(false);
    setTimeout(() => {
      if (mainContainerRef.current) {
        mainContainerRef.current.focus();
      }
    }, 50);
  };

  // Función para cerrar modal y restaurar foco
  const handleCloseCerrarModal = () => {
    setModalCerrarVisible(false);
    setTimeout(() => {
      if (mainContainerRef.current) {
        mainContainerRef.current.focus();
      }
    }, 50);
  };

  return (
    <>
      <CContainer
        ref={mainContainerRef}
        tabIndex="-1"
        style={{ outline: 'none' }}
      >
        {/* Contenedor flexible para los botones superiores */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          {/* Botón para crear una nueva caja */}
          <CButton color="primary" onClick={handleCrearCaja}>
            Crear Caja
          </CButton>

          {/* Contenedor para los botones de registrar entrada y salida */}
          <div>
            <CButton color="success" className="me-2" onClick={() => alert('Registrar Entrada')}>
              Registrar Entrada
            </CButton>
            <CButton color="danger" onClick={() => alert('Registrar Salida')}>
              Registrar Salida
            </CButton>
          </div>
        </div>

        {/* Mensaje si no hay cajas creadas */}
        {cajas.length === 0 && (
          <p className="text-center">No hay cajas físicas creadas.</p>
        )}

        {/* Mostrar las cajas creadas */}
        {cajas.length > 0 && (
          <div>
            {cajas.map((caja, index) => (
              <CCard
                key={index}
                style={{
                  backgroundColor: caja.estado === 'ABIERTA' ? '#54733a' : '', // Verde de Bootstrap
                  color: caja.estado === 'ABIERTA' ? '#fff' : '', // Texto blanco
                }}
                className="mb-3"
              >
                <CCardBody className="d-flex justify-content-between align-items-center">
                  {/* Información de la caja */}
                  <div>
                    <CCardTitle>{caja.nombreCaja}</CCardTitle>
                    <CCardText>
                      <strong>Estado:</strong> {caja.estado}
                    </CCardText>
                  </div>
                  {/* Botones de abrir, cerrar, editar y eliminar */}
                  <div>
                    {/* Botón Abrir (solo si la caja está CERRADA) */}
                    {caja.estado === 'CERRADA' && (
                      <CButton
                        color="success"
                        onClick={() => handleAbrirCaja(index)}
                        className="me-2"
                      >
                        Abrir Caja
                      </CButton>
                    )}
                    {/* Botón Cerrar (solo si la caja está ABIERTA) */}
                    {caja.estado === 'ABIERTA' && (
                      <CButton
                        color="danger"
                        onClick={() => mostrarConfirmacionCierre(index)}
                        className="me-2"
                        ref={index === cajaACerrarIndex ? cerrarButtonRef : null}
                      >
                        Cerrar Caja
                      </CButton>
                    )}
                    {/* Botón Editar */}
                    <CButton
                      color="warning"
                      onClick={() => handleEditarCaja(index)}
                      className="me-2"
                    >
                      Editar
                    </CButton>
                    {/* Botón Eliminar */}
                    <CButton
                      color="danger"
                      onClick={() => mostrarConfirmacionEliminar(index)}
                      ref={index === cajaAEliminarIndex ? eliminarButtonRef : null}
                    >
                      Eliminar
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            ))}
          </div>
        )}

        {/* Modal de confirmación para cerrar caja */}
        <CModal
          visible={modalCerrarVisible}
          onClose={handleCloseCerrarModal}
          alignment="center"
        >
          <CModalHeader closeButton>
            <h5>Confirmación</h5>
          </CModalHeader>
          <CModalBody>
            ¿Está seguro que desea cerrar esta caja?
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={handleCloseCerrarModal}
            >
              Cancelar
            </CButton>
            <CButton
              color="danger"
              onClick={confirmarCerrarCaja}
            >
              Confirmar
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Modal de confirmación para eliminar caja */}
        <CModal
          visible={modalEliminarVisible}
          onClose={handleCloseEliminarModal}
          alignment="center"
        >
          <CModalHeader closeButton>
            <h5>Confirmación</h5>
          </CModalHeader>
          <CModalBody>
            ¿Está seguro que desea eliminar esta caja?
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={handleCloseEliminarModal}
            >
              Cancelar
            </CButton>
            <CButton
              color="danger"
              onClick={confirmarEliminarCaja}
            >
              Confirmar
            </CButton>
          </CModalFooter>
        </CModal>
      </CContainer>

      {/* Toast para mensajes */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
        <CToast
          visible={toastVisible}
          autohide={true}
          delay={3000}
          className={`bg-${toastType} text-white`}
        >
          <CToastHeader closeButton className={`bg-${toastType} text-white`}>
            <strong className="me-auto">{toastType === 'success' ? 'Éxito' : 'Error'}</strong>
          </CToastHeader>
          <CToastBody>{toastMessage}</CToastBody>
        </CToast>
      </div>
    </>
  );
};

export default Caja;