import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fish } from 'lucide-react';
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import UserLogin from "../hooks/UserLogin";
import { authService } from "../services/AuthService";

const LoginForm = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // ← Agregar esto

    const { form, getData, changed } = UserLogin(async (data) => {
        setLoading(true);
        setError('');
        
        try {
            const result = await authService.login(data);
            
            console.log('Login exitoso:', result);
            
            // Guardar el usuario en localStorage
            localStorage.setItem('user', JSON.stringify(result.data));
            
            // Redirigir al dashboard
            navigate('/'); // ← Cambiar aquí
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    });

    return ( 
        <>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    {/* Header del formulario */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                            <Fish className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido</h1>
                        <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={getData} className="space-y-6">
                        <EmailInput 
                            name="email"
                            value={form.email} 
                            onChange={changed}
                            disabled={loading}
                        />
                        
                        <PasswordInput 
                            name="password"
                            value={form.password} 
                            onChange={changed}
                            disabled={loading}
                        />

                        {/* Recordar contraseña */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={loading}
                                />
                                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                            </label>
                            <button 
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                disabled={loading}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        {/* Botón de inicio de sesión */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    ¿No tienes una cuenta?{' '}
                    <button 
                        type="button"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        disabled={loading}
                    >
                        Regístrate aquí
                    </button>
                </p>
            </div>
        </>
    );
}
 
export default LoginForm;