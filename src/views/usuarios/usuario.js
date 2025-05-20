import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';

// COMPONENTE PARA VER LOS USUARIOS Y PODER EDITAR SUS PERMISOS EN EL COMPONENTE DE rolesYpermisos.js

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await apiClient.get('/usuarios/completo');
        const usuariosConIndice = response.data.map((usuario, index) => ({
          ...usuario,
          uniqueIndex: `user-${index}-${usuario.idAcceso || 'no-id'}`,
        }));
        setUsuarios(usuariosConIndice);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };
    obtenerUsuarios();
  }, []);

  // Función para manejar la edición de permisos
  const handleEditarPermisos = (idAcceso) => {
    if (idAcceso) {
      navigate(`/rolesYpermisos/${idAcceso}`);
    } else {
      console.warn('ID de acceso no definido');
    }
  };

  // Filtrar usuarios según el término de búsqueda
  const filteredUsuarios = usuarios.filter(user =>
    user.nombreTrabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cargoTrabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  return (
    <div className="p-4">
      <CCard className="shadow-sm">
        {/* Encabezado del componente */}
        <CCardHeader className="bg-primary text-white d-flex align-items-center justify-content-between">
          <h3 className="m-0">Gestión de Usuarios</h3>
          <CFormInput
            placeholder="Buscar por nombre, cargo o usuario"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-25"
          />
        </CCardHeader>
        <CCardBody>
          {/* Tabla de usuarios */}
          <CTable striped hover responsive bordered className="table-hover">
            <CTableHead className="bg-light">
              <CTableRow>
                <CTableHeaderCell className="text-center fw-bold">Nombre</CTableHeaderCell>
                <CTableHeaderCell className="text-center fw-bold">Cargo</CTableHeaderCell>
                <CTableHeaderCell className="text-center fw-bold">Usuario</CTableHeaderCell>
                <CTableHeaderCell className="text-center fw-bold">Rol</CTableHeaderCell>
                <CTableHeaderCell className="text-center fw-bold">Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsuarios.length > 0 ? (
                currentUsuarios.map((user) => (
                  <CTableRow key={user.uniqueIndex}>
                    <CTableDataCell className="text-center">{user.nombreTrabajador}</CTableDataCell>
                    <CTableDataCell className="text-center">{user.cargoTrabajador}</CTableDataCell>
                    <CTableDataCell className="text-center">{user.nombreUsuario}</CTableDataCell>
                    <CTableDataCell className="text-center">{user.rol}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      {/* Botón para editar permisos */}
                      <CButton
                        color="success"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditarPermisos(user.idAcceso)}
                      >
                        Editar
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center">
                    No se encontraron usuarios.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          {/* Paginación */}
          <CPagination aria-label="Page navigation" className="justify-content-center mt-4">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="btn-outline-secondary"
            >
              Anterior
            </CPaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <CPaginationItem
                key={index}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
                className={index + 1 === currentPage ? 'btn-primary' : 'btn-outline-secondary'}
              >
                {index + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="btn-outline-secondary"
            >
              Siguiente
            </CPaginationItem>
          </CPagination>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Usuarios;