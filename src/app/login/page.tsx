'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react'; // Importando os ícones

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const res = await fetch('http://localhost:5000/auth/login', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });
  
    const data = await res.json();
  
    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert(data.message || 'Credenciais inválidas!');
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'} 
              placeholder="Senha"
              value={senha}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)} // Alterna a visibilidade da senha
            >
              {showPassword ? (
                <EyeOff color="black" size={20} />
              ) : (
                <Eye color="black" size={20} />
              )}
            </button>
          </div>

          <button type="submit">Entrar</button>
        </form>
      </div>

      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f0f0f0; 
        }

        .login-container {
          max-width: 400px;
          padding: 20px;
          text-align: center;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }

        input {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          box-sizing: border-box;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .password-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-container input {
          width: 100%;
          padding-right: 40px;
        }

        .eye-icon {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
        }

        .eye-icon:hover {
          background: none;
        }

        .eye-icon svg {
          color: black;
          width: 20px;
          height: 20px;
        }

        button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #0070f3, #005bb5);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s ease-in-out, transform 0.2s ease;
        }

        button:hover {
          background: linear-gradient(135deg, #003d99, #002766);
          transform: scale(1.05);
        }
`}</style>

    </div>
  );
};

export default LoginPage;
