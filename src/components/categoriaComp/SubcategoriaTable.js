import React from 'react';

import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CFormCheck,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';

const SubcategoriaTable = ({
  subcategorias,
  handleEdit,
  handleDelete,
  selectedSubcategorias,
  setSelectedSubcategorias,
}) => {
  // Manejar la selección/deselección de todas las subcategorías
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSubcategorias(subcategorias.map((sub) => sub.idSubcategoria));
    } else {
      setSelectedSubcategorias([]);
    }
  };

  // Manejar la selección/deselección individual de una subcategoría
  const handleSelectSubcategoria = (id) => {
    if (selectedSubcategorias.includes(id)) {
      setSelectedSubcategorias(selectedSubcategorias.filter((item) => item !== id));
    } else {
      setSelectedSubcategorias([...selectedSubcategorias, id]);
    }
  };

  return (
    <div className="table-responsive">
      {/* Tabla de Subcategorías */}
      <CTable className="align-middle mb-0">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>
              <CFormCheck
                checked={selectedSubcategorias.length === subcategorias.length && subcategorias.length > 0}
                indeterminate={
                  selectedSubcategorias.length > 0 &&
                  selectedSubcategorias.length < subcategorias.length
                }
                onChange={handleSelectAll}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>Nombre</CTableHeaderCell>
            <CTableHeaderCell>Descripción</CTableHeaderCell>
            <CTableHeaderCell>Estado</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {subcategorias.map((subcategoria) => (
            <CTableRow key={subcategoria.idSubcategoria}>
              <CTableDataCell>
                <CFormCheck
                  checked={selectedSubcategorias.includes(subcategoria.idSubcategoria)}
                  onChange={() => handleSelectSubcategoria(subcategoria.idSubcategoria)}
                />
              </CTableDataCell>
              <CTableDataCell>{subcategoria.nombre}</CTableDataCell>
              <CTableDataCell>{subcategoria.descripcion}</CTableDataCell>
              <CTableDataCell>
                <CBadge color={subcategoria.estado === 'ACTIVO' ? 'success' : 'danger'}>
                  {subcategoria.estado}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {/* Botón de Editar */}
                  <CButton
                    color="warning"
                    size="sm"
                    className="d-flex align-items-center"
                    style={{ minWidth: 36 }}
                    onClick={() => handleEdit(subcategoria)}
                    title="Editar subcategoría"
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  {/* Botón de Eliminar */}
                  <CButton
                    color="danger"
                    size="sm"
                    className="d-flex align-items-center"
                    style={{ minWidth: 36 }}
                    onClick={() => handleDelete(subcategoria.idSubcategoria)}
                    title="Eliminar subcategoría"
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default SubcategoriaTable;