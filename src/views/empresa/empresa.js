import React, { useState, useEffect } from 'react';
import EmpresaForm from '../../components/empresaComp/EmpresaForm';
import EmpresaList from '../../components/empresaComp/EmpresaList';
import apiClient from '../../services/apiClient'; // Importa el cliente Axios

const Empresa = () => {
  const [empresaEdit, setEmpresaEdit] = useState(null); // Estado para la empresa en edición
  const [firstEmpresa, setFirstEmpresa] = useState(null); // Estado para la primera empresa
  const [isFormActive, setIsFormActive] = useState(false); // Estado para activar el formulario

  useEffect(() => {
    // Cargar la primera empresa al iniciar
    fetchFirstEmpresa();
  }, []);

  const fetchFirstEmpresa = async () => {
    try {
      const response = await apiClient.get('/fs/empresas');
      const firstEmpresaData = response.data[0]; // Obtener la primera empresa
      if (firstEmpresaData) {
        setFirstEmpresa(firstEmpresaData);
      }
    } catch (error) {
      console.error('Error al obtener la primera empresa:', error);
    }
  };

  const handleAdd = () => {
    setEmpresaEdit(null); // Limpiar el estado de edición para agregar una nueva empresa
    setIsFormActive(true); // Activar el formulario
  };

  const handleEdit = (empresa) => {
    setEmpresaEdit(empresa); // Establecer la empresa seleccionada para editar
    setIsFormActive(true); // Activar el formulario
  };

  const handleSave = () => {
    setIsFormActive(false); // Desactivar el formulario después de guardar
  };

  return (
    <div>
      <h2 style={{ color: '#6f42c1' }}>Gestión de Empresas</h2> {/* Título en lila */}
      {/* Formulario de edición/creación */}
      <EmpresaForm
        empresaEdit={empresaEdit} // Pasa la empresa seleccionada para editar
        onSave={handleSave} // Reinicia el estado al guardar
        firstEmpresa={firstEmpresa} // Pasa la primera empresa para mostrar sus datos
        isFormActive={isFormActive} // Controla si el formulario está activo
      />
      <hr />
      {/* Lista de empresas */}
      <EmpresaList
        onEdit={handleEdit} // Función para activar la edición
        onAdd={handleAdd} // Función para agregar una nueva empresa
      />
    </div>
  );
};

export default Empresa;