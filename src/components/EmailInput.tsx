interface InputProps {
  name: string;
  value: string;
  onChange: ({ target }: { target: HTMLInputElement | HTMLTextAreaElement }) => void;
  disabled?: boolean;
}

const EmailInput = ({ name, value, onChange, disabled }: InputProps) => {
    return ( 
        <>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    name={name}
                    type="email"
                    value={value}
                    onChange={(e) => onChange({ target: e.target })}
                    placeholder="ejemplo@correo.com"
                    disabled={disabled}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        </>
    );
}
 
export default EmailInput;