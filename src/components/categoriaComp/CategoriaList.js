import React, { useState } from 'react';
import {
  CListGroup,
  CListGroupItem,
  CButton,
  CCollapse,
  CCard,
  CCardBody,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChevronBottom, cilChevronTop, cilPencil, cilTrash } from '@coreui/icons';

const CategoriaList = ({ categorias, selectedCategoria, setSelectedCategoria, handleEdit, handleDelete }) => {
  // Estado para controlar qué categoría está expandida
  const [expandedCategoriaId, setExpandedCategoriaId] = useState(null);

  // Función para alternar la expansión de una categoría
  const toggleExpansion = (id) => {
    if (expandedCategoriaId === id) {
      setExpandedCategoriaId(null); // Colapsar si ya está expandida
    } else {
      setExpandedCategoriaId(id); // Expandir la categoría seleccionada
    }
  };

  return (
    <div>
      <CListGroup className="border-0">
        {categorias.map((categoria) => (
          <div key={categoria.idCategoria} className="mb-2">
            <CListGroupItem
              active={selectedCategoria?.idCategoria === categoria.idCategoria}
              onClick={() => {
                setSelectedCategoria(categoria);
                toggleExpansion(categoria.idCategoria);
              }}
              className="d-flex justify-content-between align-items-center rounded shadow-sm border-0 bg-body text-body-emphasis px-3 py-2"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.2s', minHeight: '56px' }}
            >
              <span className="fw-semibold text-truncate" style={{ maxWidth: '120px' }}>{categoria.nombre}</span>
              <div className="d-flex align-items-center gap-2">
                <CBadge color={categoria.estado === 'ACTIVO' ? 'success' : 'danger'} className="px-2 py-1 fw-normal">
                  {categoria.estado}
                </CBadge>
                <CButton
                  color="link"
                  size="sm"
                  className="p-0"
                  style={{ color: 'inherit' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpansion(categoria.idCategoria);
                  }}
                  title={expandedCategoriaId === categoria.idCategoria ? 'Colapsar' : 'Expandir'}
                >
                  <CIcon icon={expandedCategoriaId === categoria.idCategoria ? cilChevronTop : cilChevronBottom} />
                </CButton>
              </div>
            </CListGroupItem>
            <CCollapse visible={expandedCategoriaId === categoria.idCategoria}>
              <CCard className="mt-2 border-0 shadow-sm bg-body-tertiary text-body-emphasis">
                <CCardBody>
                  <p className="mb-2"><strong>Descripción:</strong> {categoria.descripcion}</p>
                  <div className="d-flex flex-wrap gap-2 flex-md-row flex-column align-items-stretch align-items-md-center w-100">
                    <CButton
                      color="warning"
                      size="sm"
                      className="fw-semibold flex-fill"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(categoria);
                      }}
                      title="Editar categoría"
                    >
                      <CIcon icon={cilPencil} className="me-1" />Editar
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      className="fw-semibold flex-fill"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(categoria.idCategoria);
                      }}
                      title="Eliminar categoría"
                    >
                      <CIcon icon={cilTrash} className="me-1" />Eliminar
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCollapse>
          </div>
        ))}
      </CListGroup>
    </div>
  );
};

export default CategoriaList;