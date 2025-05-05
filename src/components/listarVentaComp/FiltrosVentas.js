import React from 'react';
import {
    CCard,
    CCardBody,
    CForm,
    CCol,
    CRow,
    CButton,
    CFormLabel,
} from '@coreui/react';

const FiltrosVentas = ({ filters, onFilterChange }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({
            ...filters,
            [name]: value,
        });
    };

    const handleEstadoChange = (estado) => {
        onFilterChange({
            ...filters,
            estado,
        });
    };

    const handleReset = () => {
        onFilterChange({
            codigo: '',
            cliente: '',
            estado: filters.estado, // Mantener el estado actual
        });
    };

    return (
        <CCard className="mb-4">
            <CCardBody>
                <CForm>
                    <CRow>
                        {/* Campo de Código de Venta */}
                        <CCol md={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="codigo">Código de Venta</CFormLabel>
                                <input
                                    type="text"
                                    id="codigo"
                                    name="codigo"
                                    className="form-control" // Clase de Bootstrap para estilizar el input
                                    placeholder="Ej: F001-0001"
                                    value={filters.codigo}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </CCol>

                        {/* Campo de Cliente */}
                        <CCol md={4}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="cliente">Cliente</CFormLabel>
                                <input
                                    type="text"
                                    id="cliente"
                                    name="cliente"
                                    className="form-control" // Clase de Bootstrap para estilizar el input
                                    placeholder="Nombre o RUC del cliente"
                                    value={filters.cliente}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </CCol>

                        {/* Botones de Estado */}
                        <CCol md={4} className="d-flex align-items-end">
                            <CButton
                                color="secondary"
                                onClick={handleReset}
                                className="mr-2"
                            >
                                Limpiar
                            </CButton>
                            <div className="btn-group" role="group">
                                <CButton
                                    color={
                                        filters.estado === 'PENDIENTE'
                                            ? 'primary'
                                            : 'outline-primary'
                                    }
                                    onClick={() => handleEstadoChange('PENDIENTE')}
                                >
                                    Pendientes
                                </CButton>
                                <CButton
                                    color={
                                        filters.estado === 'COMPLETADO'
                                            ? 'primary'
                                            : 'outline-primary'
                                    }
                                    onClick={() => handleEstadoChange('COMPLETADO')}
                                >
                                    Completadas
                                </CButton>
                                <CButton
                                    color={
                                        filters.estado === 'ANULADO'
                                            ? 'primary'
                                            : 'outline-primary'
                                    }
                                    onClick={() => handleEstadoChange('ANULADO')}
                                >
                                    Anuladas
                                </CButton>
                            </div>
                        </CCol>
                    </CRow>
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default FiltrosVentas;