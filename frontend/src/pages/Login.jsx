import {useState} from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos listos para el puente C#:", {email, password});
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
            <div style={{
                backgroundColor: '#111827',
                padding: '40px',
                borderRadius: '10px',
                border: '1px solid #374151',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{color: '#F9FAFB', textAlign: 'center', marginBottom: '30px'}}>
                    Iniciar Sesion
                </h2>

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <div>
                        <label style={{color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '5px', display: 'block'}}>
                            Correo Electronico
                        </label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            placeholder='tu@email.com'
                            required
                        />
                    </div>

                    <div>
                        <label style={{color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '5px', display: 'block'}}>
                            Contraseña
                        </label>
                        <input 
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            placeholder='***********'
                            required
                        />
                    </div>

                    <button type="submit" style={buttonStyle}>
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #374151',
    backgroundColor: '#1F2937',
    color: "#F9FAFB",
    boxSizing: 'border-box',
    outline: 'none'
};

const buttonStyle = {
    backgroundColor: '#d48c06',
    color: '#ffffff',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px'
};

export default Login;