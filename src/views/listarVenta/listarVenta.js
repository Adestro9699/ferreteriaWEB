import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';

function ListarVenta() {
    const [ventas, setVentas] = useState([]); // Estado para almacenar las ventas
    const [loading, setLoading] = useState(true); // Estado para manejar el loading
    const [error, setError] = useState(null); // Estado para manejar errores

    // Obtener el idCaja del localStorage
    const idCaja = localStorage.getItem('idCaja');

    // Función para obtener los detalles de los objetos relacionados
    const fetchDetallesRelacionados = async (venta) => {
        try {
            // Obtener detalles del cliente
            const clienteResponse = await apiClient.get(`/fs/clientes/${venta.idCliente}`);
            const cliente = clienteResponse.data;

            // Obtener detalles del tipo de comprobante
            const tipoComprobanteResponse = await apiClient.get(`/fs/tipo-comprobantes-pago/${venta.idTipoComprobantePago}`);
            const tipoComprobantePago = tipoComprobanteResponse.data;

            // Obtener detalles del tipo de pago
            const tipoPagoResponse = await apiClient.get(`/fs/tipos-pago/${venta.idTipoPago}`);
            const tipoPago = tipoPagoResponse.data;

            // Obtener detalles de la empresa
            const empresaResponse = await apiClient.get(`/fs/empresas/${venta.idEmpresa}`);
            const empresa = empresaResponse.data;

            // Retornar la venta con los detalles de los objetos relacionados
            return {
                ...venta,
                cliente,
                tipoComprobantePago,
                tipoPago,
                empresa,
            };
        } catch (err) {
            console.error(`Error obteniendo detalles relacionados para la venta ${venta.idVenta}:`, err);
            return venta; // Retornar la venta sin detalles si hay un error
        }
    };

    // Función para obtener las ventas y sus detalles relacionados
    const fetchVentas = async () => {
        try {
            // Obtener la lista de ventas
            const response = await apiClient.get('/fs/ventas');
            const ventas = response.data;

            // Obtener detalles de los objetos relacionados para cada venta
            const ventasConDetalles = await Promise.all(
                ventas.map(async (venta) => {
                    return await fetchDetallesRelacionados(venta);
                })
            );

            // Guardar las ventas con detalles en el estado
            setVentas(ventasConDetalles);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Función para confirmar una venta
    const handleConfirmarVenta = async (idVenta) => {
        try {
            // Verificar que el idCaja esté disponible
            if (!idCaja) {
                alert('No se ha seleccionado una caja. Abre una caja antes de confirmar la venta.');
                return;
            }

            // Hacer la solicitud POST para completar la venta, incluyendo el idCaja
            const response = await apiClient.post(`/fs/ventas/${idVenta}/completar`, { idCaja });
            console.log('Venta completada:', response.data);

            // Actualizar la lista de ventas después de confirmar
            fetchVentas();
        } catch (err) {
            console.error('Error confirmando la venta:', err);
            alert('No se pudo confirmar la venta. Verifica que la venta esté en estado PENDIENTE y que la caja esté abierta.');
        }
    };

    // useEffect para llamar a fetchVentas cuando el componente se monte
    useEffect(() => {
        fetchVentas();
    }, []);

    // Mostrar un mensaje de carga mientras se obtienen los datos
    if (loading) {
        return <div>Cargando ventas...</div>;
    }

    // Mostrar un mensaje de error si algo sale mal
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Renderizar la tabla de ventas
    return (
        <div>
            <h1>Lista de Ventas</h1>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Cliente</th>
                        <th>Comprobante</th>
                        <th>Tipo de Pago</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Empresa</th>
                        <th>Fecha de Venta</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta.idVenta}>
                            <td>{venta.serieComprobante}-{venta.numeroComprobante}</td>
                            <td>
                                {venta.cliente ? `${venta.cliente.nombres} ${venta.cliente.apellidos}` : 'N/A'}
                            </td>
                            <td>{venta.tipoComprobantePago?.nombre || 'N/A'}</td>
                            <td>{venta.tipoPago?.nombre || 'N/A'}</td>
                            <td>S/ {venta.totalVenta?.toFixed(2) || '0.00'}</td>
                            <td>{venta.estadoVenta}</td>
                            <td>{venta.empresa?.razonSocial || 'N/A'}</td>
                            <td>{venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleString() : 'N/A'}</td>
                            <td>
                                <button onClick={() => handleObservar(venta.idVenta)}>Observar</button>
                                <button onClick={() => handleEditar(venta.idVenta)}>Editar</button>
                                {venta.estadoVenta === 'PENDIENTE' && (
                                    <button onClick={() => handleConfirmarVenta(venta.idVenta)}>Confirmar Venta</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Funciones para manejar las opciones
const handleObservar = (idVenta) => {
    console.log(`Observar venta con ID: ${idVenta}`);
    // Aquí puedes redirigir a una página de detalles o abrir un modal
};

const handleEditar = (idVenta) => {
    console.log(`Editar venta con ID: ${idVenta}`);
    // Aquí puedes redirigir a una página de edición o abrir un modal
};

export default ListarVenta;