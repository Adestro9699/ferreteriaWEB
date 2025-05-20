import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCol,
  CRow,
  CProgress,
  CImage,
  CSpinner,
  CBadge,
  CButton,
  CTooltip
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBarcode,
  cilTag,
  cilIndustry,
  cilLayers,
  cilTruck,
  cilFolder,
  cilListRich,
  cilMoney,
  cilCart,
  cilCalendar,
  cilInfo,
  cilImage
} from '@coreui/icons';
import apiClient from '../../services/apiClient';

// FORMULARIO QUE APARECE AL DAR CLICK EN MOSTRAR

const ProductoForm = ({ producto }) => {
  // Calcular el porcentaje de stock
  const maxStock = Math.max(producto.stock * 2, 100); // Valor dinámico para el stock máximo
  const stockPercentage = Math.min((producto.stock / maxStock) * 100, 100);

  // Determinar el color de la barra de stock
  const getStockColor = () => {
    if (stockPercentage < 25) return 'danger';
    if (stockPercentage >= 25 && stockPercentage <= 74) return 'warning';
    return 'success';
  };

  // Determinar el badge de estado del producto
  const getStatusBadge = () => {
    switch (producto.estadoProducto) {
      case 'ACTIVO':
        return <CBadge color="success" shape="rounded-pill">Activo</CBadge>;
      case 'INACTIVO':
        return <CBadge color="secondary" shape="rounded-pill">Inactivo</CBadge>;
      case 'PENDIENTE':
        return <CBadge color="warning" shape="rounded-pill">Pendiente</CBadge>;
      case 'BANEADO':
        return <CBadge color="danger" shape="rounded-pill">Baneado</CBadge>;
      default:
        return <CBadge color="info" shape="rounded-pill">{producto.estadoProducto}</CBadge>;
    }
  };

  // Extraer el nombre del archivo de la ruta completa
  const getFileNameFromPath = (path) => {
    if (!path) return null;
    return path.split(/[\\\/]/).pop(); // Modificado para manejar tanto / como \
  };
  
  // Función para obtener la URL de imagen del servidor
  const getImageUrl = (fileName) => {
    if (!fileName) return null;
    // Extraer solo el nombre del archivo si es una ruta completa
    const justFileName = fileName.split(/[\\\/]/).pop();
    // Usar la URL relativa al servidor
    return `${apiClient.defaults.baseURL}/productos/imagen/${justFileName}`;
  };

  // Estados para manejar la URL de la imagen y el estado de carga
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Efecto para cargar la imagen usando la URL directa
  useEffect(() => {
    const loadImage = async () => {
      if (producto.imagenURL) {
        const fileName = getFileNameFromPath(producto.imagenURL);
        if (fileName) {
          try {
            const response = await apiClient.get(`/productos/imagen/${fileName}`, {
              responseType: 'blob',
              withCredentials: true
            });
            const blobUrl = URL.createObjectURL(response.data);
            setImageUrl(blobUrl);
          } catch (error) {
            console.error('Error al cargar la imagen:', error);
            setImageUrl(null);
          }
        }
      }
      setIsLoading(false);
    };

    loadImage();

    // Limpiar el blob al desmontar
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [producto.imagenURL]);

  return (
    <CCard className="shadow border-0 bg-body">
      <CCardHeader className="d-flex flex-wrap justify-content-between align-items-center py-3 bg-body-secondary text-body-emphasis">
        <div className="d-flex align-items-center mb-2 mb-sm-0">
          <CIcon icon={cilInfo} className="me-2" size="lg" />
          <h5 className="mb-0 fw-bold">Detalle del Producto</h5>
        </div>
        <div>{getStatusBadge()}</div>
      </CCardHeader>
      
      <CCardBody className="p-3 p-md-4 bg-body text-body">
        {/* Encabezado con nombre del producto */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 pb-3 border-bottom">
          <h3 className="fw-bold text-primary mb-2 mb-sm-0 fs-4 fs-md-3">{producto.nombreProducto}</h3>
          <h4 className="text-success fw-bold mb-0 fs-5 fs-md-4">
            <CIcon icon={cilMoney} className="me-2" />
            S/. {Number(producto.precio).toFixed(2)}
          </h4>
        </div>

        {/* Sección de imagen y detalles principales */}
        <CRow className="mb-4 g-3">
          {/* Columna izquierda: Imagen */}
          <CCol xs={12} md={4}>
            <CCard className="border-0 shadow-sm h-100 bg-body-secondary text-body-emphasis">
              <CCardBody className="p-2 p-md-3 d-flex justify-content-center align-items-center">
                {isLoading ? (
                  <div className="text-center py-4">
                    <CSpinner color="primary" />
                    <div className="mt-2 text-muted">Cargando imagen...</div>
                  </div>
                ) : imageUrl ? (
                  <CImage
                    src={imageUrl}
                    alt={producto.nombreProducto}
                    fluid
                    className="rounded"
                    style={{ 
                      maxHeight: '200px', 
                      width: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/300x300?text=Sin+imagen';
                    }}
                  />
                ) : (
                  <div className="text-center py-4">
                    <CIcon icon={cilImage} size="3xl" className="text-muted mb-3" />
                    <div className="text-muted">Imagen no disponible</div>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>

          {/* Columna derecha: Detalles principales */}
          <CCol xs={12} md={8}>
            <CCard className="border-0 shadow-sm h-100 bg-body-secondary text-body-emphasis">
              <CCardHeader className="bg-body-tertiary text-body-emphasis">
                <h6 className="mb-0 fw-bold">
                  <CIcon icon={cilListRich} className="me-2 text-primary" />
                  Descripción del Producto
                </h6>
              </CCardHeader>
              <CCardBody className="p-2 p-md-3">
                <p className="mb-3 pb-2 border-bottom small text-break">
                  {producto.descripcion || "No hay descripción disponible."}
                </p>
                
                <CRow className="g-2">
                  <CCol xs={12} sm={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <CIcon icon={cilBarcode} className="me-2 text-primary" />
                        <span className="fw-semibold small">Código de Barras:</span>
                      </div>
                      <div className="ms-4 small text-break">{producto.codigoBarra || 'No especificado'}</div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <CIcon icon={cilTag} className="me-2 text-primary" />
                        <span className="fw-semibold small">SKU:</span>
                      </div>
                      <div className="ms-4 small text-break">{producto.codigoSKU || 'No especificado'}</div>
                    </div>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <CIcon icon={cilIndustry} className="me-2 text-primary" />
                        <span className="fw-semibold small">Marca:</span>
                      </div>
                      <div className="ms-4 small text-break">{producto.marca || 'No especificado'}</div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <CIcon icon={cilLayers} className="me-2 text-primary" />
                        <span className="fw-semibold small">Material:</span>
                      </div>
                      <div className="ms-4 small text-break">{producto.material || 'No especificado'}</div>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Sección inferior con información adicional */}
        <CRow className="g-3">
          {/* Columna izquierda: Categorías y Medidas */}
          <CCol xs={12} lg={7} className="mb-3 mb-lg-0">
            <CCard className="border-0 shadow-sm h-100 bg-body-secondary text-body-emphasis">
              <CCardHeader className="bg-body-tertiary text-body-emphasis">
                <h6 className="mb-0 fw-bold">
                  <CIcon icon={cilFolder} className="me-2 text-primary" />
                  Categorización y Medidas
                </h6>
              </CCardHeader>
              <CCardBody className="p-2 p-md-3">
                <CRow className="g-2">
                  <CCol xs={12} sm={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <CIcon icon={cilFolder} className="me-2 text-primary" />
                        <span className="fw-semibold small">Categoría:</span>
                      </div>
                      <CBadge color="info" className="ms-4 py-1 py-md-2 px-2 px-md-3 small text-break">
                        {producto.subcategoria?.categoria?.nombre || "No especificado"}
                      </CBadge>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <CIcon icon={cilListRich} className="me-2 text-primary" />
                        <span className="fw-semibold small">Subcategoría:</span>
                      </div>
                      <CBadge color="light" className="ms-4 py-1 py-md-2 px-2 px-md-3 text-dark border small text-break">
                        {producto.subcategoria?.nombre || "No especificado"}
                      </CBadge>
                    </div>
                  </CCol>
                  <CCol xs={12} sm={6}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <CIcon icon={cilTruck} className="me-2 text-primary" />
                        <span className="fw-semibold small">Proveedor:</span>
                      </div>
                      <div className="ms-4 small text-break">{producto.proveedor?.nombre || "No especificado"}</div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <CIcon icon={cilLayers} className="me-2 text-primary" />
                        <span className="fw-semibold small">Unidad de Medida:</span>
                      </div>
                      <div className="ms-4 small text-break">{producto.unidadMedida?.nombreUnidad || "No especificado"}</div>
                    </div>
                  </CCol>
                </CRow>

                <div className="mt-2">
                  <div className="d-flex align-items-center mb-1">
                    <CIcon icon={cilCalendar} className="me-2 text-primary" />
                    <span className="fw-semibold small">Última actualización:</span>
                  </div>
                  <div className="ms-4 small text-break">{formatDate(producto.fechaModificacion)}</div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Columna derecha: Stock */}
          <CCol xs={12} lg={5}>
            <CCard className="border-0 shadow-sm h-100 bg-body-secondary text-body-emphasis">
              <CCardHeader className="bg-body-tertiary text-body-emphasis">
                <h6 className="mb-0 fw-bold">
                  <CIcon icon={cilCart} className="me-2 text-primary" />
                  Disponibilidad en Inventario
                </h6>
              </CCardHeader>
              <CCardBody className="p-2 p-md-3 d-flex flex-column">
                <div className="text-center mb-3">
                  <div className="mb-2">
                    <span className={`h3 fw-bold text-${getStockColor()}`}>{producto.stock}</span>
                    <span className="ms-2 text-muted small">unidades disponibles</span>
                  </div>
                  
                  <CProgress 
                    value={stockPercentage} 
                    max={100} 
                    color={getStockColor()} 
                    className="mb-3" 
                    height={15}
                  />
                  
                  <CBadge color={getStockColor()} shape="rounded-pill" className="px-3 py-2">
                    {stockPercentage < 25 
                      ? 'Stock Bajo' 
                      : stockPercentage <= 74 
                        ? 'Stock Medio' 
                        : 'Stock Alto'
                    }
                  </CBadge>
                </div>
                
                <div className="mt-auto d-grid gap-2 d-md-flex justify-content-center">
                  <CTooltip content="Solo disponible para administradores" placement="top">
                    <CButton 
                      color="primary" 
                      variant="outline" 
                      className="mb-2 mb-md-0 w-100 w-md-auto"
                      disabled
                      size="sm"
                    >
                      <CIcon icon={cilTag} className="me-2" />
                      <span className="d-none d-md-inline">Ver historial de precios</span>
                      <span className="d-inline d-md-none">Historial precios</span>
                    </CButton>
                  </CTooltip>
                  <CTooltip content="Solo disponible para administradores" placement="top">
                    <CButton 
                      color="success" 
                      variant="outline"
                      className="w-100 w-md-auto"
                      disabled
                      size="sm"
                    >
                      <CIcon icon={cilCart} className="me-2" />
                      <span className="d-none d-md-inline">Ver ventas del producto</span>
                      <span className="d-inline d-md-none">Ventas</span>
                    </CButton>
                  </CTooltip>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>

      <CCardFooter className="bg-body-secondary p-3 text-body-emphasis">
        <small className="d-flex align-items-center">
          <CIcon icon={cilInfo} className="me-2" size="sm" />
          ID del Producto: {producto.idProducto}
        </small>
      </CCardFooter>
    </CCard>
  );
};

export default ProductoForm;