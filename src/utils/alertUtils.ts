import Swal from 'sweetalert2';

export const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: '#0891b2',
        confirmButtonText: 'Aceptar'
    });
};

export const showConfirm = async (title: string, text: string): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
};
