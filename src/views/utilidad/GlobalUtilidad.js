import React, { useState, useEffect } from 'react';
import { CCard, CCardHeader, CCardBody, CAlert } from '@coreui/react';
import GlobalForm from '../../components/utilidadComp/GlobalForm';
import GlobalTable from '../../components/utilidadComp/GlobalTable';
import apiClient from '../../services/apiClient';

const GlobalUtilidad = () => {
  const [parametros, setParametros] = useState([]);
  const [editingParam, setEditingParam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParametros();
  }, []);

  const fetchParametros = async () => {
    setLoading(true);
    try {
      console.log('Iniciando carga de parámetros...');
      const response = await apiClient.get('/fs/parametros');
      console.log('Respuesta de GET /fs/parametros:', response);
      setParametros(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar parámetros:', err);
      setError(err.response?.data?.message || 'Error al cargar parámetros');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      console.log('Datos recibidos para guardar:', formData);
      
      if (editingParam) { 
        console.log('Editando parámetro existente:', editingParam.clave);
  
        const updatedData = {
          valor: formData.valor,
          descripcion: formData.descripcion || editingParam.descripcion,  // 👈 Mantener si no cambia
          observaciones: formData.observaciones || editingParam.observaciones // 👈 Mantener si no cambia
        };
  
        const response = await apiClient.put(`/fs/parametros/${editingParam.clave}`, updatedData);
        console.log('Parámetro actualizado:', response.data);
      } else {
        console.log('Creando nuevo parámetro');
        const response = await apiClient.post('/fs/parametros', formData);
        console.log('Nuevo parámetro creado:', response.data);
      }
      
      setEditingParam(null);
      fetchParametros();
    } catch (err) {
      console.error('Error al guardar:', err);
      setError(err.response?.data?.message || 'Error al guardar parámetro');
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleDelete = async (clave) => {
    if (window.confirm(`¿Eliminar el parámetro ${clave}?`)) {
        setLoading(true);
        try {
            const url = `/fs/parametros/${encodeURIComponent(clave)}`;
            console.log('URL DELETE:', url);  // 👀 Verifica si la URL es la esperada

            const response = await apiClient.delete(url);
            console.log('Respuesta de DELETE:', response);

            fetchParametros();
        } catch (err) {
            console.error('Error al eliminar parámetro:', err);
            setError(err.response?.data?.message || 'Error al eliminar parámetro');
        } finally {
            setLoading(false);
        }
    }
};

  

  return (
    <CCard>
      <CCardHeader>
        <h5>Configuración Global</h5>
        <small className="text-medium-emphasis">IGV y Utilidad General</small>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <GlobalForm 
          onSubmit={handleSubmit} 
          initialData={editingParam} 
          loading={loading} 
        />
        <GlobalTable 
          data={parametros} 
          onEdit={setEditingParam} 
          onDelete={handleDelete} 
          loading={loading}
        />
      </CCardBody>
    </CCard>
  );
};

export default GlobalUtilidad;