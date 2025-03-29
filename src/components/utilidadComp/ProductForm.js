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
        const response = await apiClient.get('/fs/productos');
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
        await apiClient.put(`/fs/utilidades/${utilidad.idUtilidad}`, payload);
      } else {
        // Modo creación
        await apiClient.post('/fs/utilidades', payload);
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
      <CRow className="g-3 align-items-center"> {/* Alinea verticalmente */}
        {/* Cuadro de selección */}
        <CCol md={6}>
          <CFormSelect
            name="productoId"
            label="Seleccionar producto" // Agrega un label
            value={formData.productoId}
            onChange={(e) => setFormData({ ...formData, productoId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Seleccionar producto</option>
            {productos.map((producto) => (
              <option key={producto.idProducto} value={producto.idProducto}>
                {producto.nombreProducto} - {producto.marca}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        {/* Campo de porcentaje de utilidad */}
        <CCol md={4}>
          <CFormInput
            type="number"
            name="porcentajeUtilidad"
            label="Porcentaje de Utilidad (%)" // Label existente
            value={formData.porcentajeUtilidad || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                setFormData({ ...formData, porcentajeUtilidad: value });
              }
            }}
            placeholder="Ej: 25"
            min="0"
            max="100"
            disabled={loading}
          />
        </CCol>

        {/* Botones */}
        <CCol md={2} className="d-flex align-items-end">
          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Guardar'}
          </CButton>
          {onCancel && (
            <CButton color="secondary" className="ms-2" onClick={onCancel}>
              Cancelar
            </CButton>
          )}
        </CCol>
      </CRow>
    </CForm>
  );
};

export default ProductForm;