interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const EmailInput = ({value, onChange}:InputProps) => {
    return ( 
        <>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    value={value}
                    onChange={onChange}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
            </div>
        </>
     );
}
 
export default EmailInput;