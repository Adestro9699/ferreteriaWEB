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
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilInfo } from '@coreui/icons';

const TrabajadoresTable = ({ trabajadores, onEdit, onDelete, onView }) => {
  const getEstadoBadge = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'ACTIVO': return 'success';
      case 'INACTIVO': return 'danger';
      default: return 'secondary';
    }
  };

  if (!Array.isArray(trabajadores) || trabajadores.length === 0) {
    return (
      <CAlert color="info">
        No hay trabajadores registrados. Haga clic en "Nuevo Trabajador" para comenzar.
      </CAlert>
    );
  }

  return (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Nombre</CTableHeaderCell>
          <CTableHeaderCell>Apellido</CTableHeaderCell>
          <CTableHeaderCell>DNI</CTableHeaderCell>
          <CTableHeaderCell>Teléfono</CTableHeaderCell>
          <CTableHeaderCell>Cargo</CTableHeaderCell>
          <CTableHeaderCell>Sucursal</CTableHeaderCell>
          <CTableHeaderCell>Estado</CTableHeaderCell>
          <CTableHeaderCell>Fecha de Ingreso</CTableHeaderCell>
          <CTableHeaderCell className="text-end">Acciones</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {trabajadores.map((trabajador) => (
          <CTableRow key={trabajador.idTrabajador}>
            <CTableDataCell>{trabajador.nombreTrabajador}</CTableDataCell>
            <CTableDataCell>{trabajador.apellidoTrabajador}</CTableDataCell>
            <CTableDataCell>{trabajador.dniTrabajador}</CTableDataCell>
            <CTableDataCell>{trabajador.telefonoTrabajador}</CTableDataCell>
            <CTableDataCell>{trabajador.cargoTrabajador}</CTableDataCell>
            <CTableDataCell>
              {trabajador.sucursal ? (
                <span title={`${trabajador.sucursal.nombre} - ${trabajador.sucursal.direccion}`}>
                  {trabajador.sucursal.nombre}
                </span>
              ) : (
                <span className="text-muted">Sin asignar</span>
              )}
            </CTableDataCell>
            <CTableDataCell>
              <CBadge color={getEstadoBadge(trabajador.estadoTrabajador)}>
                {trabajador.estadoTrabajador}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>{trabajador.fechaIngresoTrabajador}</CTableDataCell>
            <CTableDataCell className="text-end">
              <CButton
                color="info"
                size="sm"
                onClick={() => onView(trabajador.idTrabajador)}
                className="me-1"
                title="Ver detalles"
              >
                <CIcon icon={cilInfo} />
              </CButton>
              <CButton
                color="warning"
                size="sm"
                onClick={() => onEdit(trabajador)}
                className="me-1"
                title="Editar"
              >
                <CIcon icon={cilPencil} />
              </CButton>
              <CButton
                color="danger"
                size="sm"
                onClick={() => onDelete(trabajador.idTrabajador)}
                title="Eliminar"
              >
                <CIcon icon={cilTrash} />
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default TrabajadoresTable; 