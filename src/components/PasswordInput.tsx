import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  name: string;
  value: string;
  onChange: ({ target }: { target: HTMLInputElement | HTMLTextAreaElement }) => void;
  disabled?: boolean;
}

const PasswordInput = ({ name, value, onChange, disabled }: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return ( 
        <>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                </label>
                <div className="relative">
                    <input
                        id="password"
                        name={name}
                        type={showPassword ? "text" : "password"}
                        value={value}
                        onChange={(e) => onChange({ target: e.target })}
                        placeholder="••••••••"
                        disabled={disabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={disabled}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
 
export default PasswordInput;