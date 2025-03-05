import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CFormCheck,
  CFormSelect,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CButton,
  CAlert,
} from '@coreui/react';
import apiClient from '../../services/apiClient';

const RolesYPermisos = () => {
  const { usuarioId } = useParams(); // idAcceso
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState({
    // INVENTARIO
    "/productos": false,
    "/categorias": false,
    "/subcategorias": false,
    "/proveedores": false,
    "/movimientos": false,

    // FACTURACIÓN
    "/ventas": false,
    "/lista-ventas": false,
    "/cotizaciones": false,
    "/compras": false,
    "/transferencias": false,

    // CLIENTES
    "/clientes": false,
    "/creditos": false,

    // USUARIOS Y PERMISOS
    "/usuarios": false,
    "/roles-permisos": false,
    "/cajas": false,

    // REPORTES
    "/reportes/ventas": false,
    "/reportes/compras": false,
    "/reportes/inventario": false,
    "/reportes/transferencias": false,

    // CONFIGURACIÓN
    "/configuracion/empresa": false,
    "/configuracion/parametria": false,
    "/configuracion/backup": false,

    // EXTRAS
    "/notificaciones": false,
    "/calendario": false,
    "/soporte": false,
  });
  const [rol, setRol] = useState('USER');

  useEffect(() => {
    if (usuarioId) {
      const cargarUsuario = async () => {
        try {
          const response = await apiClient.get('/fs/usuarios/completo');
          const usuarioCompleto = response.data.find(u => u.idAcceso === parseInt(usuarioId));

          // Manejar permisos vacíos
          const permisosIniciales = usuarioCompleto?.permisos || permisos;

          setUsuario(usuarioCompleto);
          setRol(usuarioCompleto?.rol || 'USER');
          setPermisos(permisosIniciales);
        } catch (error) {
          console.error('Error al cargar usuario:', error);
        }
      };
      cargarUsuario();
    }
  }, [usuarioId]);

  /**
   * Manejar cambios en los checkboxes de grupos
   */
  const handleGroupCheckboxChange = (groupName) => {
    let endpoints;

    switch (groupName) {
      // INVENTARIO
      case 'productos':
        endpoints = ["/productos", "/categorias", "/subcategorias", "/proveedores"];
        break;
      case 'movimientos':
        endpoints = ["/movimientos"];
        break;

      // FACTURACIÓN
      case 'ventas':
        endpoints = ["/ventas", "/lista-ventas"];
        break;
      case 'cotizaciones':
        endpoints = ["/cotizaciones"];
        break;
      case 'compras':
        endpoints = ["/compras"];
        break;
      case 'transferencias':
        endpoints = ["/transferencias"];
        break;

      // CLIENTES
      case 'clientes':
        endpoints = ["/clientes", "/creditos"];
        break;

      // USUARIOS Y PERMISOS
      case 'usuarios':
        endpoints = ["/usuarios", "/roles-permisos", "/cajas"];
        break;

      // REPORTES
      case 'reportes-ventas':
        endpoints = ["/reportes/ventas"];
        break;
      case 'reportes-compras':
        endpoints = ["/reportes/compras"];
        break;
      case 'reportes-inventario':
        endpoints = ["/reportes/inventario"];
        break;
      case 'reportes-transferencias':
        endpoints = ["/reportes/transferencias"];
        break;

      // CONFIGURACIÓN
      case 'empresa':
        endpoints = ["/configuracion/empresa", "/configuracion/parametria", "/configuracion/backup"];
        break;

      // EXTRAS
      case 'notificaciones':
        endpoints = ["/notificaciones"];
        break;
      case 'calendario':
        endpoints = ["/calendario"];
        break;
      case 'soporte':
        endpoints = ["/soporte"];
        break;

      default:
        endpoints = [];
    }

    const newPermisos = { ...permisos };

    endpoints.forEach(endpoint => {
      newPermisos[endpoint] = !permisos[endpoint]; // Solo alterna los endpoints específicos
    });

    setPermisos(newPermisos);
  };

  /**
   * Guardar cambios en el backend (AHORA INCLUYE EL ROL)
   */
  // Agregar estado para la notificación
  const [mensajeGuardado, setMensajeGuardado] = useState(null);

  const handleGuardar = async () => {
    try {
      const requestBody = {
        rol: rol,
        permisos: permisos,
      };

      const response = await apiClient.put(`/fs/accesos/${usuarioId}/permisos`, requestBody);
      if (response.status === 200) {
        setMensajeGuardado("Permisos actualizados correctamente.");
        setTimeout(() => setMensajeGuardado(null), 3000); // Ocultar después de 3 segundos
        setTimeout(() => navigate('/usuario'), 3000); // Redirige después de mostrar el mensaje

      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setMensajeGuardado("Error al actualizar los permisos. Inténtalo de nuevo.");
      setTimeout(() => setMensajeGuardado(null), 3000); // Ocultar después de 3 segundos
    }
  };

  if (!usuarioId) {
    return (
      <CCard>
        <CCardBody>
          <CAlert color="info">Seleccione un usuario para editar permisos.</CAlert>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard>
      <CCardHeader>
        <h3>Editar Permisos - {usuario?.nombreTrabajador}</h3>
      </CCardHeader>
      <CCardBody>
        {/* Selector de Rol */}
        <div className="mb-4">
          <label className="form-label">Rol:</label>
          <CFormSelect
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="USER">Usuario Normal (USER)</option>
            <option value="ADMIN">Administrador (ADMIN)</option>
          </CFormSelect>
        </div>

        {/* PERMISOS POR CATEGORÍA */}
        <CAccordion alwaysOpen>
          {/* INVENTARIO */}
          <CAccordionItem>
            <CAccordionHeader>📦 INVENTARIO</CAccordionHeader>
            <CAccordionBody>
              <CFormCheck
                label="Productos"
                checked={
                  permisos['/productos'] &&
                  permisos['/categorias'] &&
                  permisos['/subcategorias'] &&
                  permisos['/proveedores']
                }
                onChange={() => handleGroupCheckboxChange('productos')}
                className="mb-3"
              />
              <CFormCheck
                label="Movimientos"
                checked={permisos['/movimientos']}
                onChange={() => handleGroupCheckboxChange('movimientos')}
                className="mb-3"
              />
            </CAccordionBody>
          </CAccordionItem>

          {/* FACTURACIÓN */}
          <CAccordionItem>
            <CAccordionHeader>💳 FACTURACIÓN</CAccordionHeader>
            <CAccordionBody>
              <CFormCheck
                label="Ventas"
                checked={
                  permisos['/ventas'] &&
                  permisos['/lista-ventas']
                }
                onChange={() => handleGroupCheckboxChange('ventas')}
                className="mb-3"
              />
              <CFormCheck
                label="Cotizaciones"
                checked={permisos['/cotizaciones']}
                onChange={() => handleGroupCheckboxChange('cotizaciones')}
                className="mb-3"
              />
              <CFormCheck
                label="Compras"
                checked={permisos['/compras']}
                onChange={() => handleGroupCheckboxChange('compras')}
                className="mb-3"
              />
              <CFormCheck
                label="Transferencias"
                checked={permisos['/transferencias']}
                onChange={() => handleGroupCheckboxChange('transferencias')}
                className="mb-3"
              />
            </CAccordionBody>
          </CAccordionItem>

          {/* CLIENTES */}
          <CAccordionItem>
            <CAccordionHeader>👥 CLIENTES</CAccordionHeader>
            <CAccordionBody>
              <CFormCheck
                label="Lista de Clientes"
                checked={
                  permisos['/clientes'] &&
                  permisos['/creditos']
                }
                onChange={() => handleGroupCheckboxChange('clientes')}
                className="mb-3"
              />
            </CAccordionBody>
          </CAccordionItem>

          {/* USUARIOS Y PERMISOS */}
          <CAccordionItem>
            <CAccordionHeader>👤 USUARIOS Y PERMISOS</CAccordionHeader>
            <CAccordionBody>
              <CFormCheck
                label="Usuarios"
                checked={
                  permisos['/usuarios'] &&
                  permisos['/roles-permisos'] &&
                  permisos['/cajas']
                }
                onChange={() => handleGroupCheckboxChange('usuarios')}
                className="mb-3"
              />
            </CAccordionBody>
          </CAccordionItem>

          {/* REPORTES */}
          <CAccordionItem>
            <CAccordionHeader>📊 REPORTES</CAccordionHeader>
            <CAccordionBody>
              <CFormCheck
                label="Reportes de Ventas"
                checked={permisos['/reportes/ventas']}
                onChange={() => handleGroupCheckboxChange('reportes-ventas')}
                className="mb-3"
              />
              <CFormCheck
                label="Reportes de Compras"
                checked={permisos['/reportes/compras']}
                onChange={() => handleGroupCheckboxChange('reportes-compras')}
                className="mb-3"
              />
              <CFormCheck
                label="Reportes de Inventario"
                checked={permisos['/reportes/inventario']}
                onChange={() => handleGroupCheckboxChange('reportes-inventario')}
                className="mb-3"
              />
              <CFormCheck
                label="Reportes de Transferencias"
                checked={permisos['/reportes/transferencias']}
                onChange={() => handleGroupCheckboxChange('reportes-transferencias')}
                className="mb-3"
              />
            </CAccordionBody>
          </CAccordionItem>

          {/* CONFIGURACIÓN */}
          <CAccordionItem>
            <CAccordionHeader>⚙️ CONFIGURACIÓN</CAccordionHeader>
            <CAccordionBody>
              <CFormCheck
                label="Empresa y Parametría"
                checked={
                  permisos['/configuracion/empresa'] &&
                  permisos['/configuracion/parametria'] &&
                  permisos['/configuracion/backup']
                }
                onChange={() => handleGroupCheckboxChange('empresa')}
                className="mb-3"
              />
            </CAccordionBody>
          </CAccordionItem>

          {/* EXTRAS */}
          <CAccordionItem>
            <CAccordionHeader>🔔 EXTRAS</CAccordionHeader>
            <CAccordionBody>
              <CFormCheck
                label="Notificaciones"
                checked={permisos['/notificaciones']}
                onChange={() => handleGroupCheckboxChange('notificaciones')}
                className="mb-3"
              />
              <CFormCheck
                label="Calendario"
                checked={permisos['/calendario']}
                onChange={() => handleGroupCheckboxChange('calendario')}
                className="mb-3"
              />
              <CFormCheck
                label="Soporte"
                checked={permisos['/soporte']}
                onChange={() => handleGroupCheckboxChange('soporte')}
                className="mb-3"
              />
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>

        {mensajeGuardado && (
          <CAlert color={mensajeGuardado.includes("Error") ? "danger" : "success"} className="mb-4">
            {mensajeGuardado}
          </CAlert>
        )}

        {/* Botón de Guardar */}
        <div className="mt-4">
          <CButton color="primary" onClick={handleGuardar}>
            Guardar Cambios
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default RolesYPermisos;