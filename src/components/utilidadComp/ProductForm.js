import React, { useState, useEffect } from 'react';
import {
  CForm,
  CFormSelect,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react';
import apiClient from '../../services/apiClient';

const ProductForm = ({ utilidad, onCancel, onSaved }) => {
  const [formData, setFormData] = useState({
    productoId: utilidad?.producto?.idProducto || '',
    porcentajeUtilidad: utilidad?.porcentajeUtilidad || '',
  });
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await apiClient.get('/productos');
        setProductos(response.data);
      } catch (err) {
        setError('Error al cargar productos');
      }
    };
    fetchProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const payload = {
        producto: { idProducto: parseInt(formData.productoId) },
        ...(formData.porcentajeUtilidad && {
          porcentajeUtilidad: parseInt(formData.porcentajeUtilidad),
        }),
      };

      if (utilidad) {
        // Modo edición
        await apiClient.put(`/utilidades/${utilidad.idUtilidad}`, payload);
      } else {
        // Modo creación
        await apiClient.post('/utilidades', payload);
      }

      setSuccess('Configuración guardada exitosamente');
      setFormData({ productoId: '', porcentajeUtilidad: '' });
      onSaved(); // Refresca la tabla
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CForm onSubmit={handleSubmit} className="mb-4">
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {success && <div className="alert alert-success mb-3">{success}</div>}

      {/* Fila principal */}
      <CRow className="mb-3 align-items-center">
        <CCol md={4}>
          <CFormSelect
            label="Producto"
            value={formData.productoId}
            onChange={(e) => setFormData({ ...formData, productoId: e.target.value })}
            required
            style={{ color: 'inherit' }}
          >
            <option value="" style={{ color: 'inherit' }}>Seleccione un producto</option>
            {productos.map((prod) => (
              <option key={prod.idProducto} value={prod.idProducto} style={{ color: 'inherit' }}>
                {prod.nombre || prod.nombreProducto || prod.descripcion || 'Sin nombre'}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={4}>
          <CFormInput
            label="Porcentaje de Utilidad"
            type="number"
            step="0.01"
            value={formData.porcentajeUtilidad}
            onChange={(e) => setFormData({ ...formData, porcentajeUtilidad: e.target.value })}
            placeholder="Ej: 25.50"
            required
          />
        </CCol>
        <CCol md={2} className="d-flex align-items-center mt-4">
          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : utilidad ? 'Actualizar' : 'Guardar'}
          </CButton>
          {onCancel && (
            <CButton color="secondary" className="ms-2" onClick={onCancel} disabled={loading}>
              Cancelar
            </CButton>
          )}
        </CCol>
      </CRow>
    </CForm>
  );
};

export default ProductForm;