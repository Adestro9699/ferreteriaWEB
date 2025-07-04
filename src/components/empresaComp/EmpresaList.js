import React, { useState, useEffect, forwardRef } from 'react'; // Importa useState, useEffect y forwardRef
import apiClient from '../../services/apiClient'; // Importa el cliente Axios

const EmpresaList = ({ onEdit, onAdd }, ref) => {
  const [empresas, setEmpresas] = useState([]); // Estado para almacenar la lista de empresas

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const response = await apiClient.get('/empresas');
      setEmpresas(response.data);
    } catch (error) {
      console.error('Error al obtener las empresas:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta empresa?')) {
      try {
        await apiClient.delete(`/empresas/${id}`);
        fetchEmpresas(); // Actualiza la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar la empresa:', error);
      }
    }
  };

  // Función para recargar la lista (se puede llamar desde el padre)
  const refreshList = () => {
    fetchEmpresas();
  };

  // Exponer la función refreshList al componente padre
  React.useImperativeHandle(ref, () => ({
    refreshList
  }));

  return (
    <div className="card shadow-sm p-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h3 className="text-center mb-4" style={{ color: '#6f42c1' }}>Lista de Empresas</h3>

      {/* Botón Agregar Empresa */}
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={onAdd} // Activa la función para agregar una nueva empresa
        >
          Agregar Empresa
        </button>
      </div>

      {/* Tabla de Empresas */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th>RUC</th>
              <th>Razón Social</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr key={empresa.idEmpresa}>
                <td>{empresa.ruc}</td>
                <td>{empresa.razonSocial}</td>
                <td>{empresa.direccion}</td>
                <td>{empresa.telefono}</td>
                <td>{empresa.correo}</td>
                <td>{empresa.estado}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => onEdit(empresa)} // Activa la edición
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(empresa.idEmpresa)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default forwardRef(EmpresaList);