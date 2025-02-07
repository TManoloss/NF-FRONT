'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Credenciais inválidas. Por favor, tente novamente!');
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

          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ height: '8px' }}></div> {}
          <div className="input-container">
            <label className="show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>Mostrar Senha</span>
            </label>
          </div>
          <div style={{ height: '16px' }}></div> {}
          <button type="submit">Entrar</button>
        </form>
      </div>

      {}
      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #0070f3; 
        }
        .login-container {
          max-width: 400px;
          margin: 100px auto;
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
        .input-container {
          display: flex;
          align-items: center;
          justify-content: flex-start; /* Adicionado para alinhar à esquerda */
          gap: 10px;
        }
        .show-password {
          display: flex;
          align-items: center;
          font-size: 14px;
          cursor: pointer;
          gap: 4px;
        }
        button {
          width: 100%;
          padding: 12px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
