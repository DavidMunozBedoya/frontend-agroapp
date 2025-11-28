import Swal from 'sweetalert2';

export const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: '#0891b2', // cyan-600
        confirmButtonText: 'Aceptar'
    });
};

export const showConfirm = async (title: string, text: string): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // red-500
        cancelButtonColor: '#6b7280', // gray-500
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
};
