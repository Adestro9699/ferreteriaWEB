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

// COMPONENTE PARA GUARDAR PERMISOS EN LA BASE DE DATOS (vista de roles y permisos)
const RolesYPermisos = () => {
  const { usuarioId } = useParams(); // idAcceso
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState({
    // INVENTARIO
    "/productos": false,
    "/productos/:id:GET": false,
    "/productos/:id:PUT": false,
    "/productos/:id:DELETE": false,
    "/proveedores": false,
    "/proveedores/:id:GET": false,    // Permiso para ver detalles de proveedores
    "/proveedores/:id:PUT": false,    // Permiso para editar proveedores
    "/proveedores/:id:DELETE": false, // Permiso para eliminar proveedores
    "/categorias": false,
    "/categorias/:id:GET": false,
    "/categorias/:id:PUT": false,
    "/categorias/:id:DELETE": false,
    "/subcategorias": false,
    "/subcategorias/:id:GET": false,
    "/subcategorias/:id:PUT": false,
    "/subcategorias/:id:DELETE": false,
    "/unidades-medida": false,
    "/unidades-medida/:id:GET": false,
    "/unidades-medida/:id:PUT": false,
    "/unidades-medida/:id:DELETE": false,
    "/productos/upload": false, // Permiso para subir imágenes
    "/productos/imagen/{fileName:.+}": false, // Permiso para obtener imágenes
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
    "/cajas/:id:GET": false,
    "/cajas/:id:PUT": false,
    "/cajas/:id:DELETE": false,
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

  // Objeto que mapea cada endpoint a los grupos que lo utilizan
  const endpointDependencies = {
    "/productos": ["productos"],
    "/productos/:id:GET": ["productos"],
    "/productos/:id:PUT": ["productos"],
    "/productos/:id:DELETE": ["productos"],
    "/categorias": ["productos", "categorias"],
    "/categorias/:id:GET": ["categorias"],
    "/categorias/:id:PUT": ["categorias"],
    "/categorias/:id:DELETE": ["categorias"],
    "/subcategorias": ["productos", "categorias"],
    "/subcategorias/:id:GET": ["categorias"],
    "/subcategorias/:id:PUT": ["categorias"],
    "/subcategorias/:id:DELETE": ["categorias"],
    "/proveedores": ["productos", "proveedores"],
    "/proveedores/:id:GET": ["proveedores"],
    "/proveedores/:id:PUT": ["proveedores"],
    "/proveedores/:id:DELETE": ["proveedores"],
    "/unidades-medida": ["productos"],
    "/unidades-medida/:id:GET": ["productos"],
    "/unidades-medida/:id:PUT": ["productos"],
    "/unidades-medida/:id:DELETE": ["productos"],
    "/productos/upload": ["productos"], // Asociado al grupo "Productos"
    "/productos/imagen/{fileName:.+}": ["productos"], // Asociado al grupo "Productos"  
    // ... (agrega más endpoints y sus dependencias)
    "/cajas": ["cajas", "ventas"],
    "/cajas/:id:GET": ["cajas"],
    "/cajas/:id:PUT": ["cajas"],
    "/cajas/:id:DELETE": ["cajas"],
  };

  useEffect(() => {
    if (usuarioId) {
      const cargarUsuario = async () => {
        try {
          const response = await apiClient.get('/usuarios/completo');
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

  // Función para obtener los endpoints de un grupo
  const getGroupEndpoints = (groupName) => {
    switch (groupName) {
      case 'productos':
        return [
          "/productos",
          "/productos/:id:GET",
          "/productos/:id:PUT",
          "/productos/:id:DELETE",
          "/categorias",
          "/subcategorias",
          "/proveedores",
          "/unidades-medida",
          "/productos/upload", // Nuevo endpoint para subir imágenes
          "/productos/imagen/{fileName:.+}" // Nuevo endpoint para obtener imágenes
        ];
      case 'proveedores':
        return [
          "/proveedores",
          "/proveedores/:id:GET",
          "/proveedores/:id:PUT",
          "/proveedores/:id:DELETE"
        ];
      case 'categorias':
        return [
          "/categorias",
          "/categorias/:id:GET",
          "/categorias/:id:PUT",
          "/categorias/:id:DELETE",
          "/subcategorias",
          "/subcategorias/:id:GET",
          "/subcategorias/:id:PUT",
          "/subcategorias/:id:DELETE"
        ];
      case 'cajas':
        return [
          "/cajas",
          "/cajas/:id:GET",
          "/cajas:POST",
          "/cajas/:id:PUT",
          "/cajas/:id:DELETE",
          "/cajas/abrir:POST",
          "/cajas/cerrar:POST",
          "/cajas/:idCaja/entrada-manual:POST",
          "/cajas/:idCaja/salida-manual:POST"
        ];
      // ... (otros grupos)
      default:
        return [];
    }
  };

  // Función para verificar si un endpoint está siendo utilizado por otros grupos
  const isEndpointUsedByOtherGroups = (endpoint, currentGroup) => {
    const gruposQueUsanEndpoint = endpointDependencies[endpoint] || [];
    return gruposQueUsanEndpoint.some(grupo => grupo !== currentGroup && permisos[endpoint]);
  };

  // Función principal para manejar cambios en los checkboxes de grupos
  const handleGroupCheckboxChange = (groupName) => {
    const endpoints = getGroupEndpoints(groupName);
    const newPermisos = { ...permisos };
    // Verificar si todos los endpoints del grupo están actualmente en true
    const todosMarcados = endpoints.every(endpoint => permisos[endpoint]);
    if (todosMarcados) {
      // Desmarcar solo los endpoints que no son utilizados por otros grupos
      endpoints.forEach(endpoint => {
        if (!isEndpointUsedByOtherGroups(endpoint, groupName)) {
          newPermisos[endpoint] = false;
        }
      });
    } else {
      // Marcar todos los endpoints del grupo
      endpoints.forEach(endpoint => {
        if (!permisos[endpoint]) {
          newPermisos[endpoint] = true;
        }
      });
    }
    setPermisos(newPermisos);
  };

  /**
   * Guardar cambios en el backend (AHORA INCLUYE EL ROL)
   */
  const [mensajeGuardado, setMensajeGuardado] = useState(null);
  const handleGuardar = async () => {
    try {
      const requestBody = {
        rol: rol,
        permisos: permisos,
      };
      const response = await apiClient.put(`/accesos/${usuarioId}/permisos`, requestBody);
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
    <div className="container mt-4"> 
      <CCard className="shadow-sm w-100 mx-auto" style={{ maxWidth: '1200px' }}> 
        <CCardHeader className="bg-primary text-white d-flex align-items-center justify-content-between">
          <h3 className="m-0">Editar Permisos - {usuario?.nombreTrabajador}</h3>
        </CCardHeader>
        <CCardBody>
          {/* Selector de Rol */}
          <div className="mb-4">
            <label className="form-label fw-bold">Rol:</label>
            <CFormSelect
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-50"
            >
              <option value="USER">Usuario Normal (USER)</option>
              <option value="ADMIN">Administrador (ADMIN)</option>
            </CFormSelect>
          </div>

          {/* PERMISOS POR CATEGORÍA */}
          <CAccordion alwaysOpen className="border rounded">
            {/* INVENTARIO */}
            <CAccordionItem className="border-bottom">
              <CAccordionHeader className="bg-light fw-bold">📦 INVENTARIO</CAccordionHeader>
              <CAccordionBody>
                <CFormCheck
                  label="Productos"
                  checked={
                    permisos['/productos'] &&
                    permisos['/productos/:id:GET'] &&
                    permisos['/productos/:id:PUT'] &&
                    permisos['/productos/:id:DELETE'] &&
                    permisos['/categorias'] &&
                    permisos['/subcategorias'] &&
                    permisos['/proveedores'] &&
                    permisos['/unidades-medida'] &&
                    permisos['/productos/upload'] && // Nuevo endpoint
                    permisos['/productos/imagen/{fileName:.+}'] // Nuevo endpoint
                  }
                  onChange={() => handleGroupCheckboxChange('productos')}
                  className="mb-3"
                />
                <CFormCheck
                  label="Proveedores"
                  checked={
                    permisos['/proveedores'] &&
                    permisos['/proveedores/:id:GET'] &&
                    permisos['/proveedores/:id:PUT'] &&
                    permisos['/proveedores/:id:DELETE']
                  }
                  onChange={() => handleGroupCheckboxChange('proveedores')}
                  className="mb-3"
                />
                <CFormCheck
                  label="Categorias"
                  checked={
                    permisos['/categorias'] &&
                    permisos['/categorias/:id:GET'] &&
                    permisos['/categorias/:id:PUT'] &&
                    permisos['/categorias/:id:DELETE'] &&
                    permisos['/subcategorias'] &&
                    permisos['/subcategorias/:id:GET'] &&
                    permisos['/subcategorias/:id:PUT'] &&
                    permisos['/subcategorias/:id:DELETE']
                  }
                  onChange={() => handleGroupCheckboxChange('categorias')}
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
            <CAccordionItem className="border-bottom">
              <CAccordionHeader className="bg-light fw-bold">💳 FACTURACIÓN</CAccordionHeader>
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
            <CAccordionItem className="border-bottom">
              <CAccordionHeader className="bg-light fw-bold">👥 CLIENTES</CAccordionHeader>
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
            <CAccordionItem className="border-bottom">
              <CAccordionHeader className="bg-light fw-bold">👤 USUARIOS Y PERMISOS</CAccordionHeader>
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
                <CFormCheck
                  label="Cajas"
                  checked={
                    permisos['/cajas'] &&
                    permisos['/cajas/:id:GET'] &&
                    permisos['/cajas/:id:PUT'] &&
                    permisos['/cajas/:id:DELETE']
                  }
                  onChange={() => handleGroupCheckboxChange('cajas')}
                  className="mb-3"
                />
              </CAccordionBody>
            </CAccordionItem>

            {/* REPORTES */}
            <CAccordionItem className="border-bottom">
              <CAccordionHeader className="bg-light fw-bold">📊 REPORTES</CAccordionHeader>
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
            <CAccordionItem className="border-bottom">
              <CAccordionHeader className="bg-light fw-bold">⚙️ CONFIGURACIÓN</CAccordionHeader>
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
            <CAccordionItem className="border-bottom">
              <CAccordionHeader className="bg-light fw-bold">🔔 EXTRAS</CAccordionHeader>
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

          {/* Mensaje de confirmación o error */}
          {mensajeGuardado && (
            <CAlert color={mensajeGuardado.includes("Error") ? "danger" : "success"} className="mt-4">
              {mensajeGuardado}
            </CAlert>
          )}

          {/* Botón de Guardar */}
          <div className="d-flex justify-content-end mt-4">
            <CButton color="primary" onClick={handleGuardar}>
              Guardar Cambios
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default RolesYPermisos;