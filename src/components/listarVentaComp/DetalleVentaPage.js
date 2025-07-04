import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard, CCardHeader, CCardBody, CButton,
  CListGroup, CListGroupItem, CBadge, CRow,
  CCol, CTable, CSpinner, CTooltip, CAlert,
  CContainer, CModal, CModalHeader, CModalBody,
  CModalFooter, CModalTitle, CTableHead, CTableBody,
  CTableRow, CTableHeaderCell, CTableDataCell
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPrint, cilCheckCircle, cilTrash, cilArrowLeft } from '@coreui/icons';
import apiClient from '../../services/apiClient';

const DetalleVentaPage = ({ 
  venta: ventaProp, 
  visible, 
  onClose, 
  showPrintButton = true,
  showConfirmButton = false,
  showDeleteButton = false,
  confirmButtonText = "Confirmar Venta",
  deleteButtonText = "Eliminar Venta",
  confirmButtonDisabled = false,
  deleteButtonDisabled = false,
  onConfirm,
  onDelete,
  isConfirming = false,
  isDeleting = false
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(ventaProp || null);
  const [loading, setLoading] = useState(!ventaProp);
  const [error, setError] = useState(null);
  const [comprobanteInfo, setComprobanteInfo] = useState(null);
  const [loadingComprobante, setLoadingComprobante] = useState(false);

  // Verificar token al inicio
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token de autenticación al cargar el componente');
      setError('No hay token de autenticación. Por favor, inicie sesión nuevamente');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchVenta = async () => {
      // Si ya tenemos la venta como prop, no necesitamos hacer la petición
      if (ventaProp) {
        setVenta(ventaProp);
        setLoading(false);
        return;
      }

      // Si estamos en modo página y no hay ID, mostramos error
      if (!id && !ventaProp) {
        setError('ID de venta no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Verificar si hay token de autenticación
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No hay token de autenticación');
          setError('No hay token de autenticación. Por favor, inicie sesión nuevamente');
          setLoading(false);
          return;
        }
        
        console.log('Intentando obtener detalles de venta:', id);
        const response = await apiClient.get(`/ventas/${id}/detalle`);
        
        if (isMounted) {
          if (response && response.data) {
            console.log('Detalles de venta obtenidos exitosamente:', response.data);
            setVenta(response.data);
          } else {
            setError('No se encontraron datos de la venta');
          }
        }
      } catch (err) {
        console.error('Error al obtener detalles de venta:', err);
        if (isMounted) {
          if (err.response?.status === 404) {
            setError('No se encontró la venta solicitada');
          } else if (err.response?.status === 401) {
            setError('Sesión expirada. Por favor, inicie sesión nuevamente');
          } else if (err.response?.status === 403) {
            setError('No tiene permisos para ver esta venta');
          } else {
            setError(`Error al cargar los detalles de la venta: ${err.message}`);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVenta();

    return () => {
      isMounted = false;
    };
  }, [id, ventaProp]);

  useEffect(() => {
    const fetchComprobanteInfo = async () => {
      if (!venta?.idVenta) return;
      
      // No obtener información del comprobante para ventas pendientes
      if (venta.estadoVenta === 'PENDIENTE') {
        console.log('Venta pendiente - no se obtiene información del comprobante');
        setComprobanteInfo(null);
        return;
      }
      
      try {
        setLoadingComprobante(true);
        console.log('Obteniendo información del comprobante para venta:', venta.idVenta);
        const response = await apiClient.get(`/comprobantes/venta/${venta.idVenta}`);
        console.log('Información del comprobante obtenida:', response.data);
        setComprobanteInfo(response.data);
      } catch (error) {
        console.error('Error al obtener información del comprobante:', error);
        // Para ventas completadas/anuladas, mostrar error pero no redirigir
        if (venta.estadoVenta !== 'PENDIENTE') {
          console.error('Error al obtener información del comprobante para venta completada:', error);
        }
        setComprobanteInfo(null);
      } finally {
        setLoadingComprobante(false);
      }
    };

    fetchComprobanteInfo();
  }, [venta?.idVenta, venta?.estadoVenta]);

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return `S/ ${parseFloat(value || 0).toFixed(2)}`;
  };

  // Función para determinar el color del badge según estado
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'COMPLETADA': return 'success';
      case 'ANULADA': return 'danger';
      default: return 'primary';
    }
  };

  // Función para obtener el nombre del cliente
  const getNombreCliente = () => {
    if (venta?.razonSocialCliente) return venta.razonSocialCliente;
    if (venta?.nombresCliente && venta?.apellidosCliente) {
      return `${venta.nombresCliente} ${venta.apellidosCliente}`;
    }
    return 'N/A';
  };

  // Obtener el label correcto para el documento del cliente
  const getLabelDocumentoCliente = () => {
    if ((venta.tipoComprobante || '').toUpperCase().includes('FACTURA')) return 'RUC';
    if ((venta.tipoComprobante || '').toUpperCase().includes('BOLETA')) return 'DNI';
    return venta.tipoDocumentoCliente || 'Documento';
  };

  // Función para obtener el primer nombre real (penúltimo elemento)
  const getPrimerNombre = (nombreCompleto) => {
    if (!nombreCompleto) return 'N/A';
    const partes = nombreCompleto.trim().split(' ');
    if (partes.length < 2) return partes[0] || 'N/A';
    return partes[partes.length - 2];
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      onConfirm();
    } else {
      setIsConfirming(true);
      try {
        await apiClient.put(`/ventas/${id}/confirmar`);
        navigate('/listarVenta');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsConfirming(false);
      }
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      onDelete();
    } else {
      setIsDeleting(true);
      try {
        await apiClient.delete(`/ventas/${id}`);
        navigate('/listarVenta');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handlePrint = () => {
    if (!venta) {
      console.error('No hay información de venta disponible');
      return;
    }

    // Para ventas pendientes, mostrar mensaje informativo
    if (venta.estadoVenta === 'PENDIENTE') {
      alert('No se puede imprimir una venta pendiente. Debe confirmar la venta primero.');
      return;
    }

    if (!comprobanteInfo) {
      console.error('No hay información del comprobante disponible');
      alert('No hay información del comprobante disponible para imprimir.');
      return;
    }

    console.log('Información del comprobante:', comprobanteInfo);
    console.log('Cadena para QR:', comprobanteInfo.cadenaParaCodigoQr);

    // Función para convertir número a letras
    const numberToWords = (num) => {
      const units = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
      const teens = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
      const tens = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
      
      if (num === 0) return 'CERO';
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        if (num % 10 === 0) return tens[Math.floor(num / 10)];
        return tens[Math.floor(num / 10)] + ' Y ' + units[num % 10];
      }
      if (num < 1000) {
        if (num === 100) return 'CIEN';
        if (num < 200) return 'CIENTO ' + numberToWords(num - 100);
        return units[Math.floor(num / 100)] + 'CIENTOS' + (num % 100 === 0 ? '' : ' ' + numberToWords(num % 100));
      }
      return 'NÚMERO GRANDE';
    };

    // Obtener el nombre del cliente
    const getNombreCliente = () => {
      if (venta.razonSocialCliente) return venta.razonSocialCliente;
      if (venta.nombresCliente && venta.apellidosCliente) {
        return `${venta.nombresCliente} ${venta.apellidosCliente}`;
      }
      return 'CLIENTE NO ESPECIFICADO';
    };

    // Obtener el RUC/DNI del cliente
    const getDocumentoCliente = () => {
      return venta.numeroDocumentoCliente || 'N/A';
    };

    // Formatear fecha
    const formatFecha = (fechaString) => {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-PE');
    };

    // Formatear fecha y hora
    const formatFechaHora = (fechaString) => {
      const fecha = new Date(fechaString);
      return fecha.toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Calcular totales
    const subtotal = venta.detalles?.reduce((acc, detalle) => acc + (detalle.subtotalSinIGV || 0), 0) || 0;
    const igv = venta.detalles?.reduce((acc, detalle) => acc + (detalle.igvAplicado || 0), 0) || 0;
    const total = venta.totalVenta || 0;
    
    // Calcular descuento total sin IGV
    const descuentoTotal = venta.detalles?.reduce((acc, detalle) => {
      const descuentoMonetario = (detalle.precioUnitario * (detalle.descuento || 0) / 100);
      const descuentoSinIGV = descuentoMonetario / (1 + (venta.valorIgvActual || 18.00) / 100);
      return acc + descuentoSinIGV;
    }, 0) || 0;

    // Generar URL del QR
    const qrUrl = comprobanteInfo.cadenaParaCodigoQr 
      ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(comprobanteInfo.cadenaParaCodigoQr)}`
      : '';

    console.log('URL del QR:', qrUrl);

    // Generar el HTML del ticket
    const ticketHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: white;
            display: flex;
            justify-content: center;
          }
          .ticket-container {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            width: 80mm;
            max-width: 80mm;
            background: white;
            padding: 5mm;
            box-sizing: border-box;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .line { border-top: 1px dashed #000; margin: 5px 0; }
          .section { margin-bottom: 5px; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
            font-size: 11px;
          }
          
          th, td {
            padding: 2px 0;
            text-align: left;
          }
          
          th:first-child, td:first-child {
            text-align: left;
            padding-left: 0;
          }
          
          th:nth-child(2), td:nth-child(2) {
            text-align: left;
            padding-left: 0;
          }
          
          th:nth-child(3), td:nth-child(3) {
            text-align: right;
            padding-right: 0;
          }
          
          th:last-child, td:last-child {
            text-align: right;
            padding-right: 0;
          }
          .qr { display: flex; justify-content: center; margin-top: 10px; }
          img.qr-img { width: 120px; height: 120px; border: 1px solid #ccc; }
          @media print { 
            body {
              margin: 0;
              padding: 0;
            }
            .ticket-container { 
              width: 80mm; 
              max-width: 80mm;
              margin: 0;
              padding: 5mm;
              font-size: 10px;
            }
            .qr-img {
              width: 100px;
              height: 100px;
            }
          }
          /* Estilos específicos para impresión */
          @media print {
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            
            .ticket {
              width: 80mm;
              height: auto;
              padding: 2mm;
              font-size: 10px;

            }
            
            .no-print {
              display: none !important;
            }
            
            .qr-img {
              width: 100px;
              height: 100px;
            }
            
            /* Eliminar márgenes de la página */
            @page {
              size: auto;
              margin: 0mm;
            }
            
            /* Ocultar encabezado y pie de página del navegador */
            @page {
              margin: 0;
            }
            
            /* Ocultar elementos del navegador */
            body::before,
            body::after {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="ticket-container">
          <div class="center bold">${venta.razonSocialEmpresa || 'EMPRESA'}</div>
          <div class="center">RUC ${venta.rucEmpresa || 'N/A'}</div>
          <div class="center bold">${venta.tipoComprobante || 'COMPROBANTE'}</div>
          <div class="center">${venta.serieComprobante || ''}-${venta.numeroComprobante || ''}</div>
          <div class="line"></div>
          <div class="section">
            <div><b>ADQUIRIENTE</b></div>
            <div><b>${getLabelDocumentoCliente()}:</b> ${getDocumentoCliente()}</div>
            <div>${getNombreCliente()}</div>
            ${(venta.tipoComprobante || '').toUpperCase().includes('FACTURA') && venta.direccionCliente ? `<div>${venta.direccionCliente}</div>` : ''}
            <div>FECHA DE VENTA: ${formatFechaHora(venta.fechaVenta)}</div>
            <div>CAJERO: ${getPrimerNombre(venta.cajeroNombreUsuario).toUpperCase()}</div>
            <div>VENDEDOR: ${getPrimerNombre(venta.vendedorNombreCompleto).toUpperCase()}</div>
            <div>MONEDA: ${venta.moneda || 'SOLES'}</div>
          </div>
          <div class="line"></div>
          <table>
            <thead>
              <tr>
                <th>[CANT.] DESCRIPCIÓN</th>
                <th>P/U</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${venta.detalles?.map(detalle => {
                const descuentoMonetario = (detalle.precioUnitario * (detalle.descuento || 0) / 100);
                return `
                <tr>
                  <td>[${detalle.cantidad.toFixed(2)}] NIU ${detalle.codigoBarra || 'N/A'} ${detalle.nombreProducto || 'PRODUCTO'}</td>
                  <td class="right">${detalle.precioUnitario.toFixed(2)}<br>(-${descuentoMonetario.toFixed(2)})</td>
                  <td class="right">${detalle.subtotal.toFixed(2)}</td>
                </tr>
              `}).join('') || ''}
            </tbody>
          </table>
          <div class="section">
            <table style="width:100%; margin-top:5px;">
              <tr>
                <td style="text-align:right; font-weight:normal;">GRAVADA S/</td>
                <td style="text-align:right;"> ${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="text-align:right; font-weight:normal;">IGV (${(venta.valorIgvActual  || 18.00).toFixed(2)}%) S/</td>
                <td style="text-align:right;"> ${igv.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="text-align:right; font-weight:bold;">TOTAL S/</td>
                <td style="text-align:right; font-weight:bold;"> ${total.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          <div class="section">
            <div>IMPORTE EN LETRAS: ${numberToWords(Math.floor(total))} CON ${Math.round((total % 1) * 100).toString().padStart(2, '0')}/100 SOLES</div>
          </div>
          <div class="section center">
            Representación impresa de la ${venta.tipoComprobante || 'COMPROBANTE'}<br>
            <a href="${comprobanteInfo.enlace}" target="_blank">${comprobanteInfo.enlace}</a><br>
            Autorizado mediante Resolución de Intendencia<br>
            No.034-005-0005315
          </div>
          ${qrUrl ? `
          <div class="qr">
            <img src="${qrUrl}" alt="QR" class="qr-img">
          </div>
          ` : '<div class="center">QR no disponible</div>'}
        </div>
      </body>
      </html>
    `;

    console.log('HTML del ticket generado');

    // Crear una nueva ventana para imprimir
    const printWindow = window.open('', '_blank');
    printWindow.document.write(ticketHTML);
    printWindow.document.close();
    
    // Esperar a que se cargue el contenido y luego imprimir
    printWindow.onload = () => {
      console.log('Ventana de impresión cargada');
      printWindow.print();
      printWindow.close();
    };
  };

  const handleVerPDF = () => {
    if (venta?.estadoVenta === 'PENDIENTE') {
      alert('No hay PDF disponible para ventas pendientes. Debe confirmar la venta primero.');
      return;
    }
    
    if (comprobanteInfo?.enlaceDelPdf) {
      window.open(comprobanteInfo.enlaceDelPdf, '_blank');
    } else {
      alert('No hay PDF disponible para esta venta.');
    }
  };

  const handleDescargarXML = () => {
    if (venta?.estadoVenta === 'PENDIENTE') {
      alert('No hay XML disponible para ventas pendientes. Debe confirmar la venta primero.');
      return;
    }
    
    if (comprobanteInfo?.enlaceDelXml) {
      window.open(comprobanteInfo.enlaceDelXml, '_blank');
    } else {
      alert('No hay XML disponible para esta venta.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <CSpinner color="primary" />
        </div>
      );
    }

    if (error) {
      return (
        <CAlert color="danger" className="m-3">
          {error}
        </CAlert>
      );
    }

    if (!venta) {
      return (
        <CAlert color="warning" className="m-3">
          No se encontró la venta solicitada
        </CAlert>
      );
    }

    return (
      <CCardBody>
        <CRow>
          {/* Información General */}
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>
                <h5>Información General</h5>
              </CCardHeader>
              <CCardBody>
                <CTable borderless>
                  <tbody>
                    <tr>
                      <td><strong>Estado:</strong></td>
                      <td>
                        <CBadge color={getEstadoBadge(venta.estadoVenta)}>
                          {venta.estadoVenta}
                        </CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Fecha:</strong></td>
                      <td>{new Date(venta.fechaVenta).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td><strong>Empresa:</strong></td>
                      <td>{venta.razonSocialEmpresa || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>RUC Empresa:</strong></td>
                      <td>{venta.rucEmpresa || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Tipo de Comprobante:</strong></td>
                      <td>{venta.tipoComprobante || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Tipo de Pago:</strong></td>
                      <td>{venta.tipoPago || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Moneda:</strong></td>
                      <td>{venta.moneda || 'N/A'}</td>
                    </tr>
                  </tbody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Información del Cliente */}
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>
                <h5>Información del Cliente</h5>
              </CCardHeader>
              <CCardBody>
                <CTable borderless>
                  <tbody>
                    <tr>
                      <td><strong>Nombre/Razón Social:</strong></td>
                      <td>{getNombreCliente()}</td>
                    </tr>
                    <tr>
                      <td><strong>Tipo/N° Documento:</strong></td>
                      <td>{venta.tipoDocumentoCliente || 'N/A'}: {venta.numeroDocumentoCliente || 'N/A'}</td>
                    </tr>
                    {venta.direccionCliente && (
                      <tr>
                        <td><strong>Dirección:</strong></td>
                        <td>{venta.direccionCliente}</td>
                      </tr>
                    )}
                  </tbody>
                </CTable>
              </CCardBody>
            </CCard>
            <CCard className="mb-4">
              <CCardHeader>
                <h5>Auditoría</h5>
              </CCardHeader>
              <CCardBody>
                <CTable borderless>
                  <tbody>
                    <tr>
                      <td><strong>Vendedor:</strong></td>
                      <td>{venta.vendedorNombreCompleto || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Cajero:</strong></td>
                      <td>{venta.cajeroNombreUsuario || 'N/A'}</td>
                    </tr>
                  </tbody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Productos */}
        <CCard className="mb-4">
          <CCardHeader>
            <h5>Productos</h5>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Ítem</CTableHeaderCell>
                  <CTableHeaderCell>Código</CTableHeaderCell>
                  <CTableHeaderCell>Producto</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Cantidad</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Unidad de medida</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">P.U. (S/)</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Dscto %</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Subtotal</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {venta.detalles?.map((detalle, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{detalle.codigoBarra || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{detalle.nombreProducto || 'N/A'}</CTableDataCell>
                    <CTableDataCell className="text-center">{detalle.cantidad.toFixed(2)}</CTableDataCell>
                    <CTableDataCell className="text-center">{detalle.unidadMedida || 'N/A'}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatCurrency(detalle.precioUnitario)}</CTableDataCell>
                    <CTableDataCell className="text-end">{detalle.descuento?.toFixed(2) || '0.00'}%</CTableDataCell>
                    <CTableDataCell className="text-end">{formatCurrency(detalle.subtotal)}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <tfoot>
                <tr>
                  <td colSpan="7" className="text-end"><strong>Subtotal sin IGV:</strong></td>
                  <td className="text-end"><strong>{formatCurrency(venta.detalles?.reduce((acc, detalle) => acc + (detalle.subtotalSinIGV || 0), 0))}</strong></td>
                </tr>
                <tr>
                  <td colSpan="7" className="text-end"><strong>IGV ({(venta.valorIgvActual || 18.00).toFixed(2)}%):</strong></td>
                  <td className="text-end"><strong>{formatCurrency(venta.detalles?.reduce((acc, detalle) => acc + (detalle.igvAplicado || 0), 0))}</strong></td>
                </tr>
                <tr>
                  <td colSpan="7" className="text-end"><strong>Total:</strong></td>
                  <td className="text-end"><strong>{formatCurrency(venta.totalVenta)}</strong></td>
                </tr>
              </tfoot>
            </CTable>
          </CCardBody>
        </CCard>
      </CCardBody>
    );
  };

  // Si estamos en modo modal
  if (visible !== undefined) {
    return (
      <CModal visible={visible} onClose={onClose} size="lg">
        <CModalHeader>
          <CModalTitle>Detalles de la Venta</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {renderContent()}
        </CModalBody>
        <CModalFooter>
          {comprobanteInfo?.enlaceDelPdf && (
            <CButton 
              color="info" 
              onClick={handleVerPDF} 
              className="me-2"
              disabled={loadingComprobante}
            >
              Ver PDF
            </CButton>
          )}
          {comprobanteInfo?.enlaceDelXml && (
            <CButton 
              color="info" 
              onClick={handleDescargarXML} 
              className="me-2"
              disabled={loadingComprobante}
            >
              Descargar XML
            </CButton>
          )}
          {showPrintButton && venta?.estadoVenta !== 'PENDIENTE' && (
            <CButton color="info" onClick={handlePrint} className="me-2">
              <CIcon icon={cilPrint} className="me-2" />
              Imprimir
            </CButton>
          )}
          {showDeleteButton && (
            <CButton
              color="danger"
              onClick={handleDelete}
              disabled={deleteButtonDisabled || isDeleting}
              className="me-2"
            >
              {isDeleting ? (
                <><CSpinner size="sm" /> Eliminando...</>
              ) : (
                <><CIcon icon={cilTrash} className="me-2" /> {deleteButtonText}</>
              )}
            </CButton>
          )}
          {showConfirmButton && (
            <CButton
              color="success"
              onClick={handleConfirm}
              disabled={confirmButtonDisabled || isConfirming}
            >
              {isConfirming ? (
                <><CSpinner size="sm" /> Confirmando...</>
              ) : (
                <><CIcon icon={cilCheckCircle} className="me-2" /> {confirmButtonText}</>
              )}
            </CButton>
          )}
          <CButton color="secondary" onClick={onClose}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    );
  }

  // Si estamos en modo página
  return (
    <CContainer fluid>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Detalles de la Venta</h4>
            <small className="text-muted">Código: {venta?.serieComprobante || '-'}-{venta?.numeroComprobante || '-'}</small>
          </div>
          <div>
            <CButton color="secondary" onClick={() => {
              // Redirigir a la pestaña correcta según el estado de la venta
              if (venta?.estadoVenta === 'PENDIENTE') {
                navigate('/listarVenta?tab=pendientes');
              } else {
                navigate('/listarVenta?tab=completadas');
              }
            }} className="me-2">
              <CIcon icon={cilArrowLeft} className="me-2" />
              Volver
            </CButton>
            {comprobanteInfo?.enlaceDelPdf && (
              <CButton 
                color="info" 
                onClick={handleVerPDF} 
                className="me-2"
                disabled={loadingComprobante}
              >
                Ver PDF
              </CButton>
            )}
            {comprobanteInfo?.enlaceDelXml && (
              <CButton 
                color="info" 
                onClick={handleDescargarXML} 
                className="me-2"
                disabled={loadingComprobante}
              >
                Descargar XML
              </CButton>
            )}
            {showPrintButton && venta?.estadoVenta !== 'PENDIENTE' && (
              <CButton color="info" onClick={handlePrint} className="me-2">
                <CIcon icon={cilPrint} className="me-2" />
                Imprimir
              </CButton>
            )}
          </div>
        </CCardHeader>
        {renderContent()}
      </CCard>
    </CContainer>
  );
};

export default DetalleVentaPage;