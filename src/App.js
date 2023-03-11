import './App.scss';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export function Login() {
  return (
    <div className="flex align-items-center justify-content-center h-screen">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6 mx-auto">
        <div className="text-center mb-5">
          <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1678566572/logo_b3jhhd.png" alt="hyper" height={110} className="mb-3" />
          <div className="text-900 text-3xl font-medium mb-3">Panel de control</div>
          <span className="text-600 font-medium line-height-3">Inicia sesión para acceder al panel de control.</span>
        </div>

        <div>
          <label htmlFor="email" className="block text-900 font-medium mb-2">Correo electrónico</label>
          <InputText id="email" type="text" placeholder="Introduce tu correo electrónico" className="w-full mb-3" />

          <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
          <InputText id="password" type="password" placeholder="Introduce tu contraseña" className="w-full mb-3" />

          <Button label="Iniciar sesión" icon="pi pi-user" className="w-full" />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
