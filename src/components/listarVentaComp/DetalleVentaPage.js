import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard, CCardHeader, CCardBody, CButton,
  CListGroup, CListGroupItem, CBadge, CRow,
  CCol, CTable, CSpinner, CTooltip, CAlert,
  CContainer
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPrint, cilCheckCircle, cilTrash, cilArrowLeft } from '@coreui/icons';
import apiClient from '../../services/apiClient';

const DetalleVentaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar datos de la venta
  useEffect(() => {
    const fetchVenta = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/ventas/${id}/detalle`);
        setVenta(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los detalles de la venta');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenta();
  }, [id]);

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
    setIsConfirming(true);
    try {
      await apiClient.put(`/ventas/${id}/confirmar`);
      navigate('/listarVenta');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/ventas/${id}`);
      navigate('/listarVenta');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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
    <CContainer fluid>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Detalles de la Venta</h4>
            <small className="text-muted">Código: {venta.serieComprobante || '-'}-{venta.numeroComprobante || '-'}</small>
          </div>
          <div>
            <CButton color="secondary" onClick={() => navigate('/listarVenta')} className="me-2">
              <CIcon icon={cilArrowLeft} className="me-2" />
              Volver
            </CButton>
            <CButton color="info" onClick={handlePrint} className="me-2">
              <CIcon icon={cilPrint} className="me-2" />
              Imprimir
            </CButton>
            {venta.estadoVenta === 'PENDIENTE' && (
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
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Precio Unitario</th>
                    <th className="text-end">Descuento</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-end">Subtotal sin IGV</th>
                    <th className="text-end">IGV</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.detalles?.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.nombreProducto || 'N/A'}</td>
                      <td className="text-center">{detalle.cantidad.toFixed(2)}</td>
                      <td className="text-end">{formatCurrency(detalle.precioUnitario)}</td>
                      <td className="text-end">{formatCurrency(detalle.descuento)}</td>
                      <td className="text-end">{formatCurrency(detalle.subtotal)}</td>
                      <td className="text-end">{formatCurrency(detalle.subtotalSinIGV)}</td>
                      <td className="text-end">{formatCurrency(detalle.igvAplicado)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                    <td className="text-end"><strong>{formatCurrency(venta.totalVenta)}</strong></td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </CTable>
            </CCardBody>
          </CCard>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default DetalleVentaPage;