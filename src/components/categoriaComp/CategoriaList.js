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
import { cilChevronBottom, cilChevronTop } from '@coreui/icons';

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
      <CListGroup>
        {categorias.map((categoria) => (
          <div key={categoria.idCategoria}>
            {/* Encabezado de la categoría */}
            <CListGroupItem
              active={selectedCategoria?.idCategoria === categoria.idCategoria}
              onClick={() => {
                setSelectedCategoria(categoria);
                toggleExpansion(categoria.idCategoria); // Alternar expansión
              }}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{categoria.nombre}</span>
              <CButton
  style={{
    color:
      document.documentElement.getAttribute('data-coreui-theme') === 'dark'
        ? '#ffffff' // Color blanco para modo oscuro
        : '#000000', // Color negro para modo claro
  }}
  size="sm"
  onClick={(e) => {
    e.stopPropagation(); // Evitar que el clic afecte a setSelectedCategoria
    toggleExpansion(categoria.idCategoria);
  }}
>
  <CIcon
    icon={expandedCategoriaId === categoria.idCategoria ? cilChevronTop : cilChevronBottom}
  />
</CButton>
            </CListGroupItem>

            {/* Submenú con descripción y estado */}
            <CCollapse visible={expandedCategoriaId === categoria.idCategoria}>
              <CCard className="mt-2">
                <CCardBody>
                  <p><strong>Descripción:</strong> {categoria.descripcion}</p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <CBadge color={categoria.estado === 'ACTIVO' ? 'success' : 'danger'}>
                      {categoria.estado}
                    </CBadge>
                  </p>
                  <div className="d-flex gap-2">
                    <CButton
                      color="warning"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que el clic afecte a setSelectedCategoria
                        handleEdit(categoria);
                      }}
                    >
                      Editar
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que el clic afecte a setSelectedCategoria
                        handleDelete(categoria.idCategoria);
                      }}
                    >
                      Eliminar
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