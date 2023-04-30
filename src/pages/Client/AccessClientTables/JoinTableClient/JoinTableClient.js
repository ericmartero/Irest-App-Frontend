import React, { useRef, useState } from 'react';
import { useTableBooking, useAuth } from '../../../../hooks';
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import * as Yup from 'yup';
import '../AccessClientTables.scss';

export function JoinTableClient(props) {

  const { join } = useAuth();
  const toastError = useRef(null);
  const history = useHistory();
  const { joinTable } = useTableBooking();
  const [submitted, setSubmitted] = useState(false);

  const showError = (error) => {
    toastError.current.show({ severity: 'error', summary: 'Error al acceder a la mesa', detail: error.message, life: 3000 });
  }

  const formik = useFormik({
    initialValues: {
      key: '',
    },

    validationSchema: Yup.object({
      key: Yup.string().required(true),
    }),

    onSubmit: async (values) => {
      if (!formik.errors.key) {
        try {
          const response = await joinTable(props.table.id, values.key);
          const { tokenSession } = response;
          join(tokenSession);
          history.push(`/client/id_table=${props.table.id}&key=${values.key}`);
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
  }

  return (
    <>
      <Toast ref={toastError} position="top-center" />
      <div className='image-container'>
        <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1682460299/ushuaia_ibiza_wxoois.jpg" alt="hyper" className='image-fill-container' />
      </div>
      <div className="flex align-items-center justify-content-center content-container">
        <div className="p-4 w-full lg:w-6 mx-auto">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3">Bienvenido a {props.table?.establishment.name}</div>
            <span className="text-600 font-medium line-height-3">Introduce la clave de acceso para acceder a la mesa</span>
          </div>
          <form onSubmit={onFormSubmit}>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-lock"></i>
              </span>
              <InputText id="key" type="password" placeholder="Introduce la clave" className={submitted && formik.errors.key ? "w-full p-invalid" : "w-full"}
                value={formik.values.key} onChange={formik.handleChange} autoComplete='current-password' />
            </div>
            {submitted && formik.errors.key && <small className="p-error">Contraseña requerida</small>}

            <Button type="submit" label={`Acceder a la mesa ${props.table?.number}`} className="w-full mt-3"
              disabled={submitted && formik.errors.key ? true : false} />
          </form>
        </div>
      </div>
    </>
  )
}
