import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CProgress,
  CImage,
  CSpinner, // Spinner de CoreUI
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
} from '@coreui/icons';
import apiClient from '../../services/apiClient'; // Importa tu apiClient

const ProductoForm = ({ producto }) => {
  // Calcular el porcentaje de stock
  const maxStock = 1000; // Stock máximo de referencia
  const stockPercentage = (producto.stock / maxStock) * 100;

  // Determinar el color de la barra de stock
  const getStockColor = () => {
    if (stockPercentage < 25) return 'danger'; // Rojo
    if (stockPercentage >= 25 && stockPercentage <= 74) return 'warning'; // Amarillo
    return 'success'; // Verde
  };

  // Extraer el nombre del archivo de la ruta completa
  const getFileNameFromPath = (path) => {
    if (!path) return null;
    return path.split('\\').pop(); // Extrae el nombre del archivo de la ruta completa
  };

  // Estados para manejar la URL de la imagen y el estado de carga
  const [imageUrl, setImageUrl] = useState(null); // URL de la imagen
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Efecto para cargar la imagen usando apiClient
  useEffect(() => {
    const loadImage = async () => {
      const fileName = getFileNameFromPath(producto.imagenURL);
      if (fileName) {
        try {
          // Obtener la imagen como un Blob usando apiClient
          const response = await apiClient.get(`/fs/productos/imagen/${fileName}`, {
            responseType: 'blob', // Indicar que la respuesta es un Blob
          });

          // Convertir el Blob en una URL válida
          const blobUrl = URL.createObjectURL(response.data);
          setImageUrl(blobUrl);
        } catch (error) {
          console.error('Error al cargar la imagen:', error);
          setImageUrl(null); // No hay imagen disponible
        } finally {
          setIsLoading(false); // Finalizar la carga
        }
      } else {
        setIsLoading(false); // No hay imagen para cargar
      }
    };

    loadImage();
  }, [producto.imagenURL]);

  return (
    <CCard className="mb-3 shadow-sm">
      <CCardHeader className="bg-gradient-primary text-white">
        <h5 className="mb-0">Detalles del Producto</h5>
      </CCardHeader>
      <CCardBody>
        {/* Título */}
        <h4 className="mb-4">{producto.nombreProducto}</h4>

        {/* Sección de imagen, descripción y detalles */}
        <CRow className="mb-4">
          {/* Columna izquierda: Imagen */}
          <CCol md={4} className="mb-3 mb-md-0 d-flex justify-content-center align-items-center">
            {isLoading ? (
              <CSpinner color="primary" /> // Spinner de carga mientras se carga la imagen
            ) : imageUrl ? (
              <CImage
                src={imageUrl}
                alt={producto.nombreProducto}
                fluid
                className="rounded"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/300x300'; // Mostrar una imagen de respaldo si falla la carga
                }}
              />
            ) : (
              <CImage
                src="https://placehold.co/300x300" // Imagen por defecto si no hay imagen
                alt="Imagen no disponible"
                fluid
                className="rounded"
              />
            )}
          </CCol>

          {/* Columna derecha: Descripción y Detalles */}
          <CCol md={8}>
            {/* Descripción */}
            <div className="mb-4">
              <h6 className="mb-3">
                <CIcon icon={cilListRich} className="me-2" />
                DESCRIPCIÓN
              </h6>
              <p style={{ paddingLeft: '20px' }}>{producto.descripcion}</p>
            </div>

            {/* Detalles */}
            <div>
              <h6 className="mb-3">
                <CIcon icon={cilBarcode} className="me-2" />
                DETALLES
              </h6>
              <div className="d-flex align-items-center mb-2" style={{ paddingLeft: '20px' }}>
                <CIcon icon={cilBarcode} className="me-2" />
                <div>
                  <strong>Código de Barras:</strong> {producto.codigoBarra || 'No especificado'}
                </div>
              </div>
              <div className="d-flex align-items-center mb-2" style={{ paddingLeft: '20px' }}>
                <CIcon icon={cilTag} className="me-2" />
                <div>
                  <strong>SKU:</strong> {producto.codigoSKU || 'No especificado'}
                </div>
              </div>
              <div className="d-flex align-items-center mb-2" style={{ paddingLeft: '20px' }}>
                <CIcon icon={cilIndustry} className="me-2" />
                <div>
                  <strong>Marca:</strong> {producto.marca || 'No especificado'}
                </div>
              </div>
              <div className="d-flex align-items-center mb-2" style={{ paddingLeft: '20px' }}>
                <CIcon icon={cilLayers} className="me-2" />
                <div>
                  <strong>Material:</strong> {producto.material || 'No especificado'}
                </div>
              </div>
            </div>
          </CCol>
        </CRow>

        {/* Sección de detalles adicionales */}
        <CRow className="mb-4">
          <CCol md={6} className="mb-3 mb-md-0">
            <h6 className="mb-3">
              <CIcon icon={cilFolder} className="me-2" />
              INFORMACIÓN DE MEDIDA
            </h6>
            <div className="d-flex align-items-center mb-2" style={{ paddingLeft: '20px' }}>
              <strong>Unidad de Medida:&nbsp;</strong> {producto.unidadMedida?.nombreUnidad || "No especificado"}
            </div>
          </CCol>
          <CCol md={6}>
            <h6 className="mb-3">
              <CIcon icon={cilTruck} className="me-2" />
              INFORMACIÓN DEL PROVEEDOR
            </h6>
            <div className="d-flex align-items-center mb-2" style={{ paddingLeft: '20px' }}>
              <strong>Proveedor:&nbsp;</strong> {producto.proveedor?.nombre || "No especificado"}
            </div>
          </CCol>
        </CRow>

        {/* Sección de categorías */}
        <CRow className="mb-4">
          <CCol md={6} className="mb-3 mb-md-0">
            <h6 className="mb-3">
              <CIcon icon={cilFolder} className="me-2" />
              CATEGORÍA
            </h6>
            <p style={{ paddingLeft: '20px' }}>{producto.subcategoria?.categoria?.nombre || "No especificado"}</p>
          </CCol>
          <CCol md={6}>
            <h6 className="mb-3">
              <CIcon icon={cilListRich} className="me-2" />
              SUBCATEGORÍA
            </h6>
            <p style={{ paddingLeft: '20px' }}>{producto.subcategoria?.nombre || "No especificado"}</p>
          </CCol>
        </CRow>

        {/* Sección de stock y precio */}
        <CRow>
          <CCol md={6} className="mb-3 mb-md-0">
            <h6 className="mb-3">Stock Disponible</h6>
            <CProgress
              value={stockPercentage}
              max={100}
              color={getStockColor()}
              className="mb-2"
            />
            <small>{producto.stock} unidades disponibles</small>
          </CCol>
          <CCol md={6}>
            <h6 className="mb-3">Precio</h6>
            <h4 className="text-success">S/. {producto.precio}</h4>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default ProductoForm;