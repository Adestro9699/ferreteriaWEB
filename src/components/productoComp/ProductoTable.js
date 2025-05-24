import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CBadge,
  CCollapse,
  CButton,
  CCard,
  CCardBody,
  CAvatar,
  CPopover,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CModalTitle,
  CImage
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilOptions, cilSortAlphaDown, cilSortAlphaUp, cilShortText, cilMagnifyingGlass, cilX, cilImage } from '@coreui/icons';
import ProductoForm from './ProductoForm';
import apiClient from '../../services/apiClient';

//LA TABLA QUE MUESTRA EL PRODUCTO EN GENERAL

// Definir la función getBadge
const getBadge = (status) => {
  switch (status) {
    case 'ACTIVO':
      return 'success';
    case 'INACTIVO':
      return 'secondary';
    case 'PENDIENTE':
      return 'warning';
    case 'BANEADO':
      return 'danger';
    default:
      return 'primary';
  }
};

// Función para obtener la clase de color según el nivel de stock
const getStockStatusClass = (stock, stockMinimo = 10) => {
  if (stock <= 0) return 'danger';
  if (stock < stockMinimo) return 'warning';
  return 'success';
};

const ProductoTable = ({
  items,
  details,
  selectedItems,
  handleSelectItem,
  handleSelectAll,
  toggleDetails,
  handleEdit,
  confirmDelete,
  sortColumn,
  sortDirection,
  handleAdvancedSort,
}) => {
  // Estado para controlar el modal en dispositivos móviles
  const [showMobileDetailModal, setShowMobileDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [productImages, setProductImages] = useState({});
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  // Verificar el tamaño de la pantalla cuando cambie
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Cargar imágenes para todos los productos
  useEffect(() => {
    const loadProductImages = async () => {
      const images = {};
      const errors = {};

      for (const item of items) {
        if (item.imagenURL) {
          const fileName = getFileNameFromPath(item.imagenURL);
          if (fileName) {
            try {
              // Hacer la solicitud con credenciales
              const response = await apiClient.get(`/productos/imagen/${fileName}`, {
                responseType: 'blob',
                withCredentials: true
              });
              // Crear una URL del blob
              images[item.idProducto] = URL.createObjectURL(response.data);
            } catch (error) {
              console.error(`Error al procesar imagen para ${item.nombreProducto}:`, error);
              errors[item.idProducto] = true;
            }
          } else {
            errors[item.idProducto] = true;
          }
        } else {
          errors[item.idProducto] = true;
        }
      }

      setProductImages(images);
      setImageLoadErrors(errors);
    };

    loadProductImages();

    // Limpiar los blobs al desmontar
    return () => {
      Object.values(productImages).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [items]);

  // Extraer el nombre del archivo de la ruta completa
  const getFileNameFromPath = (path) => {
    if (!path) return null;
    return path.split(/[\\\/]/).pop();
  };

  // Función para obtener la URL de imagen del servidor
  const getImageUrl = (fileName) => {
    if (!fileName) return null;
    // Extraer solo el nombre del archivo si es una ruta completa
    const justFileName = fileName.split(/[\\\/]/).pop();
    // Usar la URL relativa al servidor y asegurarnos de que incluya las credenciales
    const url = `${apiClient.defaults.baseURL}/productos/imagen/${justFileName}`;
    // Agregar un timestamp para evitar el caché del navegador
    return `${url}?t=${new Date().getTime()}`;
  };

  // Función para mostrar detalles adaptada para dispositivos móviles
  const handleToggleDetails = (id, product = null) => {
    if (isMobile) {
      setSelectedProduct(product);
      setShowMobileDetailModal(true);
    } else {
      toggleDetails(id);
    }
  };

  // Generar un color de fondo aleatorio pero consistente basado en el nombre (usado como fallback)
  const getAvatarColor = (nombre) => {
    if (!nombre) return '#6c757d';
    
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
      hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#3399ff', '#20c997', '#f9b115', '#e55353', '#39f', 
      '#2eb85c', '#f86c6b', '#768192', '#321fdb', '#4638c2'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Obtener las iniciales de un nombre
  const getInitials = (nombre) => {
    if (!nombre) return '?';
    
    const words = nombre.split(' ');
    if (words.length === 1) {
      return nombre.substring(0, 2).toUpperCase();
    }
    
    return (words[0][0] + words[1][0]).toUpperCase();
  };
  
  return (
    <>
      <CTable align="middle" responsive hover className="mb-0 border-0">
        <CTableHead className="bg-light">
          <CTableRow>
            <CTableHeaderCell className="text-center" style={{ width: '40px' }}>
              <CFormCheck
                checked={items.length > 0 && selectedItems.length === items.length}
                onChange={handleSelectAll}
              />
            </CTableHeaderCell>
            <CTableHeaderCell className="cursor-pointer" onClick={() => handleAdvancedSort('nombreProducto')}>
              <div className="d-flex align-items-center">
                Producto
                {sortColumn === 'nombreProducto' && (
                  <CIcon 
                    icon={sortDirection === 'asc' ? cilSortAlphaDown : cilSortAlphaUp} 
                    className="ms-1 text-body-secondary" 
                    size="sm"
                  />
                )}
              </div>
            </CTableHeaderCell>
            <CTableHeaderCell className="cursor-pointer text-center" onClick={() => handleAdvancedSort('precio')}>
              <div className="d-flex align-items-center justify-content-center">
                Precio
                {sortColumn === 'precio' && (
                  <CIcon 
                    icon={sortDirection === 'asc' ? cilSortAlphaDown : cilSortAlphaUp} 
                    className="ms-1 text-body-secondary" 
                    size="sm"
                  />
                )}
              </div>
            </CTableHeaderCell>
            <CTableHeaderCell className="cursor-pointer text-center" onClick={() => handleAdvancedSort('stock')}>
              <div className="d-flex align-items-center justify-content-center">
                Stock
                {sortColumn === 'stock' && (
                  <CIcon 
                    icon={sortDirection === 'asc' ? cilSortAlphaDown : cilSortAlphaUp} 
                    className="ms-1 text-body-secondary" 
                    size="sm"
                  />
                )}
              </div>
            </CTableHeaderCell>
            <CTableHeaderCell className="d-none d-md-table-cell cursor-pointer" onClick={() => handleAdvancedSort('fechaModificacion')}>
              <div className="d-flex align-items-center">
                Actualización
                {sortColumn === 'fechaModificacion' && (
                  <CIcon 
                    icon={sortDirection === 'asc' ? cilSortAlphaDown : cilSortAlphaUp} 
                    className="ms-1 text-body-secondary" 
                    size="sm"
                  />
                )}
              </div>
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={{ width: '120px' }}>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {items.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-center py-5 text-muted">
                <CIcon icon={cilMagnifyingGlass} size="xl" className="mb-3 text-body-secondary" />
                <p className="mb-0">No se encontraron productos que coincidan con los criterios de búsqueda.</p>
              </CTableDataCell>
            </CTableRow>
          ) : (
            items.map((item) => (
              <React.Fragment key={item.idProducto}>
                <CTableRow className={details.includes(item.idProducto) ? 'selected-row' : ''}>
                  <CTableDataCell className="text-center">
                    <CFormCheck
                      checked={selectedItems.includes(item.idProducto)}
                      onChange={() => handleSelectItem(item.idProducto)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      {productImages[item.idProducto] ? (
                        <div 
                          className="me-3 overflow-hidden"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%',
                            border: '1px solid #e4e7ea',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <CImage
                            src={productImages[item.idProducto]}
                            alt={item.nombreProducto}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              setImageLoadErrors(prev => ({ ...prev, [item.idProducto]: true }));
                            }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%',
                            backgroundColor: getAvatarColor(item.nombreProducto),
                            color: 'white'
                          }}
                        >
                          <CIcon icon={cilImage} size="sm" />
                        </div>
                      )}
                      <div>
                        <div className="fw-semibold">{item.nombreProducto}</div>
                        <div className="small text-medium-emphasis">
                          {item.marca && (
                            <span className="me-2">{item.marca}</span>
                          )}
                          {item.subcategoria?.nombre && (
                            <span>{item.subcategoria.nombre}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <strong>S/. {parseFloat(item.precio).toFixed(2)}</strong>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge 
                      color={getStockStatusClass(item.stock)} 
                      shape="rounded-pill"
                      className="px-2 py-1"
                    >
                      {item.stock} unid.
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="d-none d-md-table-cell">
                    <div className="small text-medium-emphasis">
                      {new Date(item.fechaModificacion).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge 
                      color={getBadge(item.estadoProducto)} 
                      shape="rounded-pill"
                      className="px-2 py-1"
                    >
                      {item.estadoProducto}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      color="light"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleDetails(item.idProducto, item)}
                      className="me-1"
                      title={details.includes(item.idProducto) ? 'Ocultar detalles' : 'Ver detalles'}
                    >
                      <CIcon icon={cilShortText} className="text-body-secondary" />
                    </CButton>
                    <CButton
                      color="light"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="me-1"
                      title="Editar producto"
                    >
                      <CIcon icon={cilPencil} className="text-body-secondary" />
                    </CButton>
                    <CButton
                      color="light"
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmDelete(item.idProducto)}
                      title="Eliminar producto"
                    >
                      <CIcon icon={cilTrash} className="text-body-secondary" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
                {!isMobile && details.includes(item.idProducto) && (
                  <CTableRow className="details-row">
                    <CTableDataCell colSpan={7} className="p-0 border-0">
                      <CCollapse visible={details.includes(item.idProducto)}>
                        <CCard className="m-3 border-0 shadow-sm">
                          <CCardBody>
                            <ProductoForm producto={item} />
                          </CCardBody>
                        </CCard>
                      </CCollapse>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </React.Fragment>
            ))
          )}
        </CTableBody>
      </CTable>

      {/* Modal para dispositivos móviles */}
      <CModal 
        visible={showMobileDetailModal} 
        onClose={() => setShowMobileDetailModal(false)}
        size="lg"
        fullscreen={true}
        backdrop="static"
      >
        <CModalBody className="p-0 position-relative">
          <CButton 
            color="link" 
            className="position-fixed bottom-0 end-0 mb-4 me-4 bg-dark text-white opacity-75 d-flex align-items-center justify-content-center"
            style={{ 
              width: "42px", 
              height: "42px", 
              zIndex: 1050,
              borderRadius: "50%",
              backdropFilter: "blur(3px)",
              transition: "all 0.2s ease" 
            }}
            onClick={() => setShowMobileDetailModal(false)}
          >
            <CIcon icon={cilX} size="lg" />
          </CButton>
          {selectedProduct && <ProductoForm producto={selectedProduct} />}
        </CModalBody>
      </CModal>
    </>
  );
};

export default ProductoTable;