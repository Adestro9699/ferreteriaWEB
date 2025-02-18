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
  CFormSelect,
  CFormCheck,
  CNavbar,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CContainer,
  CButtonGroup,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilX } from '@coreui/icons';

const Usuarios = () => {
  // Estado inicial para los usuarios
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez',
      cargo_trabajador: 'Desarrollador',
      usuario: 'juanperez',
      rol: 'Editor',
      permisos: {
        dashboard: false,
        usuarios: false,
        categorias: true,
        productos: false,
      },
    },
    {
      id: 2,
      nombre: 'María López',
      cargo_trabajador: 'Diseñadora',
      usuario: 'marialopez',
      rol: 'Administrador',
      permisos: {
        dashboard: true,
        usuarios: true,
        categorias: true,
        productos: true,
      },
    },
  ]);

  // Estados para filtros, paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Función para actualizar permisos
  const handlePermisoChange = (userId, permiso) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((user) =>
        user.id === userId
          ? {
              ...user,
              permisos: {
                ...user.permisos,
                [permiso]: !user.permisos[permiso],
              },
            }
          : user
      )
    );
  };

  // Filtrado de usuarios por búsqueda
  const filteredUsuarios = usuarios.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cargo_trabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  return (
    <CContainer>
      {/* Encabezado */}
      <CCard className="mb-4">
        <CCardHeader>
          <h3>Gestión de Usuarios</h3>
        </CCardHeader>
        <CCardBody>
          {/* Barra de búsqueda */}
          <CInputGroup className="mb-3">
            <CInputGroupText>Buscar</CInputGroupText>
            <CFormInput
              placeholder="Nombre, cargo o usuario"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>

          {/* Tabla de usuarios */}
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Cargo</CTableHeaderCell>
                <CTableHeaderCell>Usuario</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>Permisos</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsuarios.map((user) => (
                <CTableRow key={user.id}>
                  <CTableDataCell>{user.nombre}</CTableDataCell>
                  <CTableDataCell>{user.cargo_trabajador}</CTableDataCell>
                  <CTableDataCell>{user.usuario}</CTableDataCell>
                  <CTableDataCell>{user.rol}</CTableDataCell>
                  <CTableDataCell>
                    <div>
                      <CFormCheck
                        label="Dashboard"
                        checked={user.permisos.dashboard}
                        onChange={() => handlePermisoChange(user.id, 'dashboard')}
                      />
                      <CFormCheck
                        label="Usuarios"
                        checked={user.permisos.usuarios}
                        onChange={() => handlePermisoChange(user.id, 'usuarios')}
                      />
                      <CFormCheck
                        label="Categorías"
                        checked={user.permisos.categorias}
                        onChange={() => handlePermisoChange(user.id, 'categorias')}
                      />
                      <CFormCheck
                        label="Productos"
                        checked={user.permisos.productos}
                        onChange={() => handlePermisoChange(user.id, 'productos')}
                      />
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" onClick={() => setSelectedUser(user)}>
                      Editar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          {/* Paginación */}
          <CPagination aria-label="Page navigation example">
            <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Anterior
            </CPaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <CPaginationItem active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)} key={i}>
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Siguiente
            </CPaginationItem>
          </CPagination>
        </CCardBody>
      </CCard>

      {/* Modal para editar usuario */}
      {selectedUser && (
        <CModal visible={!!selectedUser} onClose={() => setSelectedUser(null)}>
          <CModalHeader>
            <CModalTitle>Editar Usuario: {selectedUser.nombre}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormCheck
              label="Dashboard"
              checked={selectedUser.permisos.dashboard}
              onChange={() => handlePermisoChange(selectedUser.id, 'dashboard')}
            />
            <CFormCheck
              label="Usuarios"
              checked={selectedUser.permisos.usuarios}
              onChange={() => handlePermisoChange(selectedUser.id, 'usuarios')}
            />
            <CFormCheck
              label="Categorías"
              checked={selectedUser.permisos.categorias}
              onChange={() => handlePermisoChange(selectedUser.id, 'categorias')}
            />
            <CFormCheck
              label="Productos"
              checked={selectedUser.permisos.productos}
              onChange={() => handlePermisoChange(selectedUser.id, 'productos')}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setSelectedUser(null)}>
              Cancelar
            </CButton>
            <CButton color="primary">Guardar Cambios</CButton>
          </CModalFooter>
        </CModal>
      )}
    </CContainer>
  );
};

export default Usuarios;