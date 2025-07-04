import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CContainer, CButton, CCard, CCardBody, CCardText, CCardTitle, CModal, CModalHeader, CModalBody, CModalFooter, CToast, CToastBody, CToastHeader, CFormInput, CFormLabel } from '@coreui/react';
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

  // Estados para el modal de movimiento de caja
  const [modalMovimientoVisible, setModalMovimientoVisible] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState('');
  const [montoMovimiento, setMontoMovimiento] = useState('');
  const [observacionesMovimiento, setObservacionesMovimiento] = useState('');

  // Referencias para manejar el foco
  const mainContainerRef = useRef(null);
  const eliminarButtonRef = useRef(null);
  const cerrarButtonRef = useRef(null);

  // Obtenemos el usuario actual desde el estado de Redux
  const usuarioActual = useSelector(state => state.auth.user);
  console.log("Usuario actual desde Redux:", usuarioActual);

  // Estado para el reporte de cierre
  const [reporteCierre, setReporteCierre] = useState(null);
  const [modalReporteVisible, setModalReporteVisible] = useState(false);

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

  const handleRegistrarMovimiento = async () => {
    if (!montoMovimiento || parseFloat(montoMovimiento) <= 0) {
      setToastMessage('El monto debe ser mayor que cero');
      setToastType('danger');
      setToastVisible(true);
      return;
    }

    // Buscar la caja abierta
    const cajaAbierta = cajas.find(caja => caja.estado === 'ABIERTA');
    if (!cajaAbierta) {
      setToastMessage('No hay una caja abierta para registrar movimientos');
      setToastType('danger');
      setToastVisible(true);
      return;
    }

    const movimientoDTO = {
      monto: parseFloat(montoMovimiento),
      observaciones: observacionesMovimiento
    };

    try {
      const endpoint = tipoMovimiento === 'ENTRADA' ? 
        `/cajas/${cajaAbierta.idCaja}/entrada-manual` : 
        `/cajas/${cajaAbierta.idCaja}/salida-manual`;

      await apiClient.post(endpoint, movimientoDTO);

      // Limpiar el formulario
      setMontoMovimiento('');
      setObservacionesMovimiento('');
      setModalMovimientoVisible(false);

      // Mostrar mensaje de éxito
      setToastMessage(`${tipoMovimiento === 'ENTRADA' ? 'Entrada' : 'Salida'} registrada exitosamente`);
      setToastType('success');
      setToastVisible(true);

      // Actualizar la lista de cajas
      obtenerCajas();
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      let mensajeError = 'Error al registrar el movimiento';

      if (error.response) {
        switch (error.response.status) {
          case 400:
            mensajeError = error.response.data || 'El monto debe ser mayor que cero';
            break;
          case 404:
            mensajeError = 'Caja no encontrada';
            break;
          case 409:
            mensajeError = 'La caja está cerrada o no se pueden realizar movimientos';
            break;
          case 422:
            mensajeError = 'Saldo insuficiente para realizar la operación';
            break;
          default:
            mensajeError = error.response.data || 'Error al registrar el movimiento';
        }
      }

      setToastMessage(mensajeError);
      setToastType('danger');
      setToastVisible(true);
    }
  };

  const mostrarModalMovimiento = (tipo) => {
    setTipoMovimiento(tipo);
    setModalMovimientoVisible(true);
  };

  const obtenerReporteCierre = async (idCaja) => {
    try {
      const response = await apiClient.get(`/cajas/${idCaja}/reporte-cierre`);
      setReporteCierre(response.data);
      setModalReporteVisible(true);
    } catch (error) {
      console.error('Error al obtener el reporte de cierre:', error);
      setToastMessage('Error al obtener el reporte de cierre');
      setToastType('danger');
      setToastVisible(true);
    }
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(monto);
  };

  const renderReporteCierre = () => {
    if (!reporteCierre) return null;

    return (
      <div className="reporte-cierre">
        <div className="mb-4">
          <h4 className="text-center mb-3">CIERRE DE CAJA</h4>
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>CAJA:</strong> #{reporteCierre.idCaja} - {reporteCierre.nombreCaja}</p>
              <p><strong>RESPONSABLE:</strong> {reporteCierre.responsable}</p>
            </div>
            <div className="col-md-6">
              <p><strong>FECHA APERTURA:</strong> {formatearFecha(reporteCierre.fechaApertura)}</p>
              <p><strong>FECHA CIERRE:</strong> {formatearFecha(reporteCierre.fechaCierre)}</p>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">ENTRADAS</h5>
              </div>
              <div className="card-body">
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td>SALDO INICIAL</td>
                      <td className="text-end">{formatearMoneda(reporteCierre.saldoInicial)}</td>
                    </tr>
                    <tr>
                      <td>VENTAS EN EFECTIVO</td>
                      <td className="text-end">{formatearMoneda(reporteCierre.ventasEfectivo)}</td>
                    </tr>
                    <tr>
                      <td>INGRESOS MANUALES</td>
                      <td className="text-end">{formatearMoneda(reporteCierre.ingresosManuales)}</td>
                    </tr>
                    <tr className="table-success">
                      <td><strong>TOTAL</strong></td>
                      <td className="text-end"><strong>{formatearMoneda(reporteCierre.saldoInicial + reporteCierre.ventasEfectivo + reporteCierre.ingresosManuales)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-danger text-white">
                <h5 className="mb-0">SALIDAS</h5>
              </div>
              <div className="card-body">
                <table className="table table-sm">
                  <tbody>
                    {reporteCierre.egresosManualesList.map((egreso, index) => (
                      <tr key={index}>
                        <td>EGRESO MANUAL</td>
                        <td className="text-end">{formatearMoneda(egreso.monto)}</td>
                      </tr>
                    ))}
                    <tr className="table-danger">
                      <td><strong>TOTAL</strong></td>
                      <td className="text-end"><strong>{formatearMoneda(reporteCierre.egresosManuales)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">RESUMEN FINAL</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <h4 className="text-center">
                  SALDO CAJA: {formatearMoneda(reporteCierre.saldoFinal)}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Versión para impresión (oculta por defecto) */}
        <div className="d-none" id="printable-report">
          {`-------------------------------------------------------------
                   CIERRE DE CAJA
-------------------------------------------------------------
CAJA: ${reporteCierre.nombreCaja}
RESPONSABLE: ${reporteCierre.responsable}
FECHA APERTURA: ${formatearFecha(reporteCierre.fechaApertura)}
FECHA CIERRE: ${formatearFecha(reporteCierre.fechaCierre)}
--------------------------------------------------------------
                    ENTRADAS
--------------------------------------------------------------
SALDO INICIAL                           ${formatearMoneda(reporteCierre.saldoInicial)}
VENTAS EN EFECTIVO                      ${formatearMoneda(reporteCierre.ventasEfectivo)}
INGRESOS MANUALES                       ${formatearMoneda(reporteCierre.ingresosManuales)}
--------------------------------------------------------------
TOTAL ENTRADAS                          ${formatearMoneda(reporteCierre.saldoInicial + reporteCierre.ventasEfectivo + reporteCierre.ingresosManuales)}
--------------------------------------------------------------
                    SALIDAS
--------------------------------------------------------------
${reporteCierre.egresosManualesList.map(egreso => 
  `EGRESO MANUAL                         ${formatearMoneda(egreso.monto)}`
).join('\n')}
--------------------------------------------------------------
TOTAL SALIDAS                           ${formatearMoneda(reporteCierre.egresosManuales)}
--------------------------------------------------------------
                    RESUMEN
--------------------------------------------------------------
SALDO FINAL CAJA                        ${formatearMoneda(reporteCierre.saldoFinal)}
-------------------------------------------------------------`}
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = document.getElementById('printable-report').innerText;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte de Cierre de Caja</title>
          <style>
            body {
              font-family: monospace;
              white-space: pre;
              margin: 0;
              padding: 20px;
              font-size: 12px;
              line-height: 1.2;
            }
            @media print {
              body {
                width: 80mm;
                margin: 0;
                padding: 0;
                font-size: 10px;
                line-height: 1;
              }
              @page {
                size: 80mm auto;
                margin: 0;
              }
              /* Asegura que el contenido se ajuste al ancho del papel */
              pre {
                width: 80mm;
                margin: 0;
                padding: 2mm;
                overflow: hidden;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
            }
          </style>
        </head>
        <body>
          <pre>${printContent}</pre>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
            <CButton color="success" className="me-2" onClick={() => mostrarModalMovimiento('ENTRADA')}>
              Registrar Entrada
            </CButton>
            <CButton color="danger" onClick={() => mostrarModalMovimiento('SALIDA')}>
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
                    {/* Botón para ver reporte de cierre */}
                    {caja.estado === 'CERRADA' && (
                      <CButton
                        color="info"
                        onClick={() => obtenerReporteCierre(caja.idCaja)}
                        className="me-2"
                      >
                        Ver Reporte
                      </CButton>
                    )}
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

        {/* Modal para registrar movimiento */}
        <CModal
          visible={modalMovimientoVisible}
          onClose={() => setModalMovimientoVisible(false)}
          alignment="center"
        >
          <CModalHeader closeButton>
            <h5>Registrar {tipoMovimiento === 'ENTRADA' ? 'Entrada' : 'Salida'}</h5>
          </CModalHeader>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel>Monto</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                min="0"
                value={montoMovimiento}
                onChange={(e) => setMontoMovimiento(e.target.value)}
                placeholder="Ingrese el monto"
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Observaciones</CFormLabel>
              <CFormInput
                type="text"
                value={observacionesMovimiento}
                onChange={(e) => setObservacionesMovimiento(e.target.value)}
                placeholder="Ingrese las observaciones"
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => setModalMovimientoVisible(false)}
            >
              Cancelar
            </CButton>
            <CButton
              color={tipoMovimiento === 'ENTRADA' ? 'success' : 'danger'}
              onClick={handleRegistrarMovimiento}
            >
              Registrar
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Modal para mostrar el reporte de cierre */}
        <CModal
          visible={modalReporteVisible}
          onClose={() => setModalReporteVisible(false)}
          size="lg"
        >
          <CModalHeader closeButton>
            <h5>Reporte de Cierre de Caja</h5>
          </CModalHeader>
          <CModalBody>
            {renderReporteCierre()}
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => setModalReporteVisible(false)}
            >
              Cerrar
            </CButton>
            <CButton
              color="primary"
              onClick={handlePrint}
            >
              Imprimir
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