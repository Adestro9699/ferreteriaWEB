import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import TrabajadoresTable from '../../components/trabajadorComp/TrabajadoresTable';
import TrabajadorForm from '../../components/trabajadorComp/TrabajadorForm';
import TrabajadoresFilters from '../../components/trabajadorComp/TrabajadoresFilters';
import apiClient from '../../services/apiClient';

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [trabajadoresFiltrados, setTrabajadoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [trabajadorEdit, setTrabajadorEdit] = useState(null);

  useEffect(() => {
    cargarTrabajadores();
  }, []);

  const cargarTrabajadores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/trabajadores');
      setTrabajadores(response.data);
      setTrabajadoresFiltrados(response.data);
    } catch (err) {
      console.error('Error al cargar trabajadores:', err);
      setError('Error al cargar los trabajadores');
      setTrabajadores([]);
      setTrabajadoresFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoTrabajador = () => {
    setTrabajadorEdit(null);
    setShowForm(true);
  };

  const handleEditarTrabajador = (trabajador) => {
    setTrabajadorEdit(trabajador);
    setShowForm(true);
  };

  const handleEliminarTrabajador = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este trabajador?')) {
      try {
        await apiClient.delete(`/trabajadores/${id}`);
        cargarTrabajadores(); // Recargar la lista
      } catch (error) {
        console.error('Error al eliminar trabajador:', error);
        setError('Error al eliminar el trabajador');
      }
    }
  };

  const handleVerTrabajador = (id) => {
    // TODO: Implementar vista detallada del trabajador
    console.log('Ver trabajador:', id);
  };

  const handleSaveTrabajador = () => {
    setShowForm(false);
    setTrabajadorEdit(null);
    cargarTrabajadores();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setTrabajadorEdit(null);
  };

  const handleFilter = (filters) => {
    let filtered = [...trabajadores];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(trabajador => 
        trabajador.nombreTrabajador?.toLowerCase().includes(searchTerm) ||
        trabajador.apellidoTrabajador?.toLowerCase().includes(searchTerm) ||
        trabajador.dniTrabajador?.includes(searchTerm) ||
        trabajador.sucursal?.nombre?.toLowerCase().includes(searchTerm)
      );
    }
    
    setTrabajadoresFiltrados(filtered);
  };

  const handleClearFilters = () => {
    setTrabajadoresFiltrados(trabajadores);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
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

  return (
    <CContainer fluid>
      <CRow>
        <CCol xs={12}>
          {showForm ? (
            <TrabajadorForm
              trabajadorEdit={trabajadorEdit}
              onSave={handleSaveTrabajador}
              onCancel={handleCancelForm}
            />
          ) : (
            <>
              <TrabajadoresFilters
                onFilter={handleFilter}
                onClear={handleClearFilters}
              />
              <CCard className="mb-4">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">Gestión de Trabajadores</h4>
                    <small className="text-muted">Administrar el personal de la empresa</small>
                  </div>
                  <CButton color="primary" onClick={handleNuevoTrabajador}>
                    <CIcon icon={cilPlus} className="me-2" />
                    Nuevo Trabajador
                  </CButton>
                </CCardHeader>
                <CCardBody>
                  <TrabajadoresTable
                    trabajadores={trabajadoresFiltrados}
                    onEdit={handleEditarTrabajador}
                    onDelete={handleEliminarTrabajador}
                    onView={handleVerTrabajador}
                  />
                </CCardBody>
              </CCard>
            </>
          )}
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Trabajadores; 