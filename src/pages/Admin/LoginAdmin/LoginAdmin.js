import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { loginApi } from '../../../api/auth';
import { useAuth } from '../../../hooks';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './LoginAdmin.scss';
import './LoginError.scss';

export function LoginAdmin() {

  const { login } = useAuth();
  const toastError = useRef(null);

  const showError = (error) => {
    toastError.current.show({ severity: 'error', summary: 'Error al iniciar sessión', detail: error.message, life: 3000 });
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string().email(true).required(true),
      password: Yup.string().required(true),
    }),

    onSubmit: async (values) => {
      try {
        const response = await loginApi(values);
        const { token } = response;
        login(token);

      } catch (error) {
        showError(error);
      }
    }
  });

  return (
    <div>
      <Toast ref={toastError} position="bottom-center" className="toast" />
      <div className="flex align-items-center justify-content-center h-screen">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6 mx-auto">
          <div className="text-center mb-5">
            <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1678622048/irest-logo-white-copy_mlspdo.png" alt="hyper" height={100} className="mb-3" />
            <div className="text-900 text-3xl font-medium mb-3">Panel de control</div>
            <span className="text-600 font-medium line-height-3">Inicia sesión para acceder al panel de control.</span>
          </div>

          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">Correo electrónico</label>
            <InputText id="email" type="text" placeholder="Introduce tu correo electrónico" className={formik.errors.email ? "w-full mb-1 p-invalid" : "w-full mb-3"}
              value={formik.values.email} onChange={formik.handleChange} />

            {formik.errors.email && formik.values.email === '' ? (
              <small className="p-error mb-2">Correo electrónico requerido</small>
            ) : formik.errors.email ? (
              <small className="p-error mb-2">El correo electrónico no es correcto</small>
            ) : (
              null
            )}

            <label htmlFor="password" className={formik.errors.email ? "block text-900 font-medium mb-2 mt-3" : "block text-900 font-medium mb-2"}>Contraseña</label>
            <InputText id="password" type="password" placeholder="Introduce tu contraseña" className={formik.errors.password ? "w-full mb-1 p-invalid" : "w-full mb-3"}
              value={formik.values.password} onChange={formik.handleChange} />
            {formik.errors.password && <small className="p-error">Contraseña requerida</small>}

            <Button type="submit" label="Iniciar sesión" icon="pi pi-user" disabled={formik.errors.email || formik.errors.password ? true : false } className={formik.errors.password ? "w-full mt-3" : "w-full"} onClick={formik.handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}
