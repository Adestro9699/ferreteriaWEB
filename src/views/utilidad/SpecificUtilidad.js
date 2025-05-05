import React, { useState } from 'react';
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardHeader,
  CCardBody,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster
} from '@coreui/react';
import ProductTable from '../../components/utilidadComp/ProductTable';
import CategoryTable from '../../components/utilidadComp/CategoryTable';

const SpecificUtilidad = () => {
  const [activeTab, setActiveTab] = useState('product');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, color = 'success') => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      color,
      show: true
    };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  const handleDelete = (item) => {
    setDeleteItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Aquí se implementará la lógica de eliminación específica
      addToast('Registro eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      addToast('Error al eliminar el registro', 'danger');
    } finally {
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          <CNav variant="tabs" className="card-header-tabs">
            <CNavItem>
              <CNavLink
                active={activeTab === 'product'}
                onClick={() => setActiveTab('product')}
              >
                Por Producto
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'category'}
                onClick={() => setActiveTab('category')}
              >
                Por Categoría
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>
        <CCardBody>
          <CTabContent>
            <CTabPane visible={activeTab === 'product'}>
              <ProductTable 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onDelete={handleDelete}
                onSuccess={(message) => addToast(message)}
                onError={(message) => addToast(message, 'danger')}
              />
            </CTabPane>

            <CTabPane visible={activeTab === 'category'}>
              <CategoryTable 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onDelete={handleDelete}
                onSuccess={(message) => addToast(message)}
                onError={(message) => addToast(message, 'danger')}
              />
            </CTabPane>
          </CTabContent>

          <div className="d-flex justify-content-center align-items-center mt-3">
            <CPagination className="me-3 mb-0" aria-label="Page navigation">
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
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                &raquo;
              </CPaginationItem>
            </CPagination>
            <CFormSelect
              style={{ width: '150px' }}
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="mb-0"
            >
              <option value="10">10 registros</option>
              <option value="20">20 registros</option>
              <option value="30">30 registros</option>
            </CFormSelect>
          </div>
        </CCardBody>
      </CCard>

      {/* Modal de confirmación de eliminación */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Está seguro que desea eliminar este registro?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>
            Eliminar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Toaster para notificaciones */}
      <CToaster placement="bottom-end">
        {toasts.map((toast) => (
          <CToast
            key={toast.id}
            autohide={true}
            delay={3000}
            color={toast.color}
            visible={toast.show}
          >
            <CToastHeader closeButton>
              {toast.color === 'success' ? 'Éxito' : 'Error'}
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </>
  );
};

export default SpecificUtilidad;