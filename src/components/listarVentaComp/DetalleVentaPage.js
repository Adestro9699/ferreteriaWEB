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
        
        const response = await apiClient.get(`/ventas/${id}/detalle`);
        
        if (isMounted) {
          if (response && response.data) {
            setVenta(response.data);
          } else {
            setError('No se encontraron datos de la venta');
          }
        }
      } catch (err) {
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
    window.print();
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
                  <CTableHeaderCell>Producto</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Cantidad</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Unidad</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Precio Unit.</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Dscto %</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Subtotal</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {venta.detalles?.map((detalle, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{detalle.nombreProducto || 'N/A'}</CTableDataCell>
                    <CTableDataCell className="text-center">{detalle.cantidad.toFixed(2)}</CTableDataCell>
                    <CTableDataCell className="text-center">{detalle.unidadMedida || 'N/A'}</CTableDataCell>
                    <CTableDataCell className="text-end">{formatCurrency(detalle.precioUnitario)}</CTableDataCell>
                    <CTableDataCell className="text-end">{detalle.descuento}%</CTableDataCell>
                    <CTableDataCell className="text-end">{formatCurrency(detalle.subtotal)}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              <tfoot>
                <tr>
                  <td colSpan="6" className="text-end"><strong>Subtotal sin IGV:</strong></td>
                  <td className="text-end"><strong>{formatCurrency(venta.detalles?.reduce((acc, detalle) => acc + (detalle.subtotalSinIGV || 0), 0))}</strong></td>
                </tr>
                <tr>
                  <td colSpan="6" className="text-end"><strong>IGV (18%):</strong></td>
                  <td className="text-end"><strong>{formatCurrency(venta.detalles?.reduce((acc, detalle) => acc + (detalle.igvAplicado || 0), 0))}</strong></td>
                </tr>
                <tr>
                  <td colSpan="6" className="text-end"><strong>Total:</strong></td>
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
          {showPrintButton && (
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
            <CButton color="secondary" onClick={() => navigate('/listarVenta')} className="me-2">
              <CIcon icon={cilArrowLeft} className="me-2" />
              Volver
            </CButton>
            {showPrintButton && (
              <CButton color="info" onClick={handlePrint} className="me-2">
                <CIcon icon={cilPrint} className="me-2" />
                Imprimir
              </CButton>
            )}
            {venta?.estadoVenta === 'PENDIENTE' && (
              <>
                <CButton
                  color="danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="me-2"
                >
                  {isDeleting ? (
                    <><CSpinner size="sm" /> Eliminando...</>
                  ) : (
                    <><CIcon icon={cilTrash} className="me-2" /> Eliminar</>
                  )}
                </CButton>
                <CButton
                  color="success"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                >
                  {isConfirming ? (
                    <><CSpinner size="sm" /> Confirmando...</>
                  ) : (
                    <><CIcon icon={cilCheckCircle} className="me-2" /> Confirmar</>
                  )}
                </CButton>
              </>
            )}
          </div>
        </CCardHeader>
        {renderContent()}
      </CCard>
    </CContainer>
  );
};

export default DetalleVentaPage;