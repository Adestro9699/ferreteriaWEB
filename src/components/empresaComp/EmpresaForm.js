import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'; // Importa el cliente Axios
import EstadoSelect from './EstadoSelect'; // Importa el componente EstadoSelect
import defaultLogo from '../../assets/images/logo-semgar.jpeg'; // Importa la imagen por defecto

const EmpresaForm = ({ empresaEdit, onSave, firstEmpresa, isFormActive }) => {
  const initialState = {
    ruc: '',
    razonSocial: '',
    direccion: '',
    telefono: '',
    correo: '',
    estado: 'ACTIVO',
    logo: null, // Campo para el logo
  };

  const [formData, setFormData] = useState(empresaEdit || initialState);
  const [logoPreview, setLogoPreview] = useState(null); // URL de vista previa del logo

  useEffect(() => {
    // Actualiza el formulario cuando cambia empresaEdit o firstEmpresa
    if (empresaEdit) {
      setFormData(empresaEdit);
      setLogoPreview(empresaEdit.logo ? URL.createObjectURL(new Blob([empresaEdit.logo])) : defaultLogo);
    } else if (firstEmpresa && !empresaEdit) {
      setFormData(firstEmpresa);
      setLogoPreview(firstEmpresa.logo ? URL.createObjectURL(new Blob([firstEmpresa.logo])) : defaultLogo);
    } else {
      setFormData(initialState);
      setLogoPreview(null);
    }
  }, [empresaEdit, firstEmpresa]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setLogoPreview(URL.createObjectURL(file)); // Actualizar vista previa del logo
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData(); // Crear FormData para manejar archivos
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (empresaEdit) {
        // Actualizar empresa
        await apiClient.put(`/fs/empresas/${empresaEdit.idEmpresa}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Crear nueva empresa
        await apiClient.post('/fs/empresas', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSave(); // Llama al callback para actualizar la lista
    } catch (error) {
      console.error('Error al guardar la empresa:', error);
    }
  };

  return (
    <div className="card shadow-sm p-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h4 className="text-center mb-4">
        {empresaEdit ? 'Editar Empresa' : 'Agregar Empresa'}
      </h4>

      {/* Logo */}
      <div className="col-12 text-center mb-4">
        <div className="logo-container position-relative d-inline-block">
          <img
            src={logoPreview || defaultLogo} // Usa el logo por defecto si no hay vista previa
            alt="Logo de la empresa"
            className="rounded-circle"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          {isFormActive && (
            <label
              htmlFor="logo"
              className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1"
              style={{
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              }}
            >
              <i className="bi bi-pencil" style={{ fontSize: '1rem' }}></i>
            </label>
          )}
        </div>
        {isFormActive && (
          <input
            type="file"
            id="logo"
            name="logo"
            className="d-none"
            onChange={handleChange}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="row g-3">
        {/* RUC */}
        <div className="col-md-6">
          <label className="form-label">RUC</label>
          <input
            type="text"
            className="form-control"
            name="ruc"
            value={formData.ruc}
            onChange={handleChange}
            required
            disabled={!isFormActive} // Bloqueado si el formulario no está activo
          />
        </div>

        {/* Razón Social */}
        <div className="col-md-6">
          <label className="form-label">Razón Social</label>
          <input
            type="text"
            className="form-control"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            required
            disabled={!isFormActive} // Bloqueado si el formulario no está activo
          />
        </div>

        {/* Dirección */}
        <div className="col-md-6">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={!isFormActive} // Bloqueado si el formulario no está activo
          />
        </div>

        {/* Teléfono */}
        <div className="col-md-6">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            className="form-control"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            disabled={!isFormActive} // Bloqueado si el formulario no está activo
          />
        </div>

        {/* Correo */}
        <div className="col-md-6">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            disabled={!isFormActive} // Bloqueado si el formulario no está activo
          />
        </div>

        {/* Estado */}
        <div className="col-md-6">
          <label className="form-label">Estado</label>
          <EstadoSelect
            value={formData.estado}
            onChange={(e) => handleChange(e)}
            disabled={!isFormActive} // Bloqueado si el formulario no está activo
          />
        </div>

        {/* Botón de Guardar */}
        {isFormActive && (
          <div className="col-12 d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {empresaEdit ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EmpresaForm;