import React from 'react'
import { CButton } from '@coreui/react'

const CotizacionAcciones = ({ cotizacion, onVer, onEditar, onEliminar }) => {
  return (
    <div>
      <CButton
        color="primary"
        size="sm"
        className="me-2"
        onClick={() => onVer(cotizacion)}
      >
        Ver
      </CButton>
      <CButton
        color="warning"
        size="sm"
        className="me-2"
        onClick={() => onEditar(cotizacion)}
      >
        Editar
      </CButton>
      <CButton
        color="danger"
        size="sm"
        onClick={() => onEliminar(cotizacion.id)}
      >
        Eliminar
      </CButton>
    </div>
  )
}

export default CotizacionAcciones 