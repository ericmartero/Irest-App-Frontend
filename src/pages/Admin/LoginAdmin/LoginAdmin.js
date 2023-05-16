import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { loginApi } from '../../../api/auth';
import { useAuth } from '../../../hooks';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './LoginAdmin.scss';
import '../../../scss/ToastCenterError.scss';

export function LoginAdmin() {

  const { login } = useAuth();
  const toastError = useRef(null);
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);

  const showError = (error) => {
    toastError.current.show({ severity: 'error', summary: 'Error al iniciar sessión', detail: error.message, life: 3000 });
  };

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

      if (!formik.errors.email || !formik.errors.password) {
        try {
          const response = await loginApi(values);
          const { token } = response;
          login(token);
          history.push("/admin");

        } catch (error) {
          showError(error);
        }
      }

    }
  });

  const onFormSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    formik.handleSubmit();
  };

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

          <form onSubmit={onFormSubmit}>
            <label htmlFor="email" className="block text-900 font-medium mb-2">Correo electrónico</label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText id="email" type="text" placeholder="Introduce tu correo electrónico" className={submitted && formik.errors.email ? "w-full p-invalid" : "w-full"}
                value={formik.values.email} onChange={formik.handleChange} autoComplete='email' />
            </div>
            {submitted && formik.errors.email && formik.values.email === '' ? (
              <small className="p-error mb-2">Correo electrónico requerido</small>
            ) : submitted && formik.errors.email ? (
              <small className="p-error mb-2">El correo electrónico no es correcto</small>
            ) : (
              null
            )}

            <label htmlFor="password" className={submitted && formik.errors.email ? "block text-900 font-medium mb-2 mt-3" : "block text-900 font-medium mb-2 mt-3"}>Contraseña</label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-lock"></i>
              </span>
            <InputText id="password" type="password" placeholder="Introduce tu contraseña" className={submitted && formik.errors.password ? "w-full p-invalid" : "w-full"}
              value={formik.values.password} onChange={formik.handleChange} autoComplete='current-password'/>
            </div>
            {submitted && formik.errors.password && <small className="p-error">Contraseña requerida</small>}

            <Button type="submit" label="Iniciar sesión" disabled={submitted && (formik.errors.email || formik.errors.password) ? true : false} className={submitted && formik.errors.password ? "w-full mt-3" : "w-full mt-4"} />
          </form>
        </div>
      </div>
    </div>
  )
}
