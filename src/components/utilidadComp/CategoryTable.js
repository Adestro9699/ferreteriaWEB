import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CSpinner,
  CPagination,
  CPaginationItem,
  CAlert,
} from '@coreui/react';
import apiClient from '../../services/apiClient';
import CategoryForm from './CategoryForm';

const CategoryTable = () => {
  const [utilidades, setUtilidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUtilidades();
  }, []);

  const fetchUtilidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/fs/utilidades/categoria');
      // Mapear los datos para asegurar la estructura correcta
      const formattedData = response.data.map(item => ({
        idUtilidad: item.idUtilidad,
        categoria: item.categoria,
        porcentajeUtilidad: item.porcentajeUtilidad
      }));
      setUtilidades(formattedData);
    } catch (err) {
      console.error('Error al cargar utilidades:', err);
      setError(err.response?.data?.message || 'Error al cargar utilidades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta configuración?')) {
      try {
        await apiClient.delete(`/fs/utilidades/${id}`);
        setSuccess('Configuración eliminada correctamente');
        setError(null);
        fetchUtilidades();
      } catch (err) {
        console.error('Error al eliminar:', err);
        setError(err.response?.data?.message || 'Error al eliminar');
        setSuccess(null);
      }
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const currentItems = utilidades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(utilidades.length / itemsPerPage);

  return (
    <>
      {error && <CAlert color="danger" className="mb-3">{error}</CAlert>}
      {success && <CAlert color="success" className="mb-3">{success}</CAlert>}

      <div className="mb-4">
        <h4>{editingId ? 'Editar Utilidad' : 'Crear Nueva Utilidad'}</h4>
        <CategoryForm
          utilidad={editingId ? utilidades.find(u => u.idUtilidad === editingId) : null}
          onCancel={handleCancelEdit}
          onSaved={() => {
            fetchUtilidades();
            setEditingId(null);
            setError(null);
          }}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <CSpinner color="primary" />
        </div>
      ) : (
        <>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Categoría</CTableHeaderCell>
                <CTableHeaderCell>Utilidad (%)</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="3" className="text-center">
                    No hay utilidades por categoría configuradas
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentItems.map((utilidad) => (
                  <CTableRow key={utilidad.idUtilidad}>
                    <CTableDataCell>{utilidad.categoria?.nombre || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="success">
                        {utilidad.porcentajeUtilidad}%
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(utilidad.idUtilidad)}
                      >
                        Editar
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(utilidad.idUtilidad)}
                      >
                        Eliminar
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>

          {totalPages > 1 && (
            <CPagination className="mt-3" align="center">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                Primera
              </CPaginationItem>
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                &laquo;
              </CPaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <CPaginationItem
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                &raquo;
              </CPaginationItem>
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                Última
              </CPaginationItem>
            </CPagination>
          )}
        </>
      )}
    </>
  );
};

export default CategoryTable;