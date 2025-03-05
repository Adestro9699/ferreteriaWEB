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

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await apiClient.get('/fs/usuarios/completo');
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

  const handleEditarPermisos = (idAcceso) => {
    if (idAcceso) {
      navigate(`/rolesYpermisos/${idAcceso}`);
    } else {
      console.warn('ID de acceso no definido');
    }
  };

  const filteredUsuarios = usuarios.filter(user =>
    user.nombreTrabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cargoTrabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <h3>Gestión de Usuarios</h3>
        </CCardHeader>
        <CCardBody>
          <CFormInput
            placeholder="Buscar por nombre, cargo o usuario"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Cargo</CTableHeaderCell>
                <CTableHeaderCell>Usuario</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsuarios.map((user) => (
                <CTableRow key={user.uniqueIndex}>
                  <CTableDataCell>{user.nombreTrabajador}</CTableDataCell>
                  <CTableDataCell>{user.cargoTrabajador}</CTableDataCell>
                  <CTableDataCell>{user.nombreUsuario}</CTableDataCell>
                  <CTableDataCell>{user.rol}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      onClick={() => handleEditarPermisos(user.idAcceso)}
                    >
                      Editar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <CPagination aria-label="Page navigation">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </CPaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <CPaginationItem
                key={index}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
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