import { useState } from "react";
import { Fish } from 'lucide-react';
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

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

                    {/* Formulario */}
                    <div className="space-y-6">
                    <EmailInput 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    
                    <PasswordInput 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    {/* Recordar contraseña */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                        </label>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    {/* Botón de inicio de sesión */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Iniciar sesión
                    </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    ¿No tienes una cuenta?{' '}
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Regístrate aquí
                    </button>
                </p>
            </div>
        </>
     );
}
 
export default LoginForm;