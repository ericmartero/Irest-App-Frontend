import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export function JoinTableClient(props) {

  return (
    <div className="flex align-items-center justify-content-center h-screen">
      <div className="p-4 w-full lg:w-6 mx-auto">
        <div className="text-center mb-5">
          <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1678622048/irest-logo-white-copy_mlspdo.png" alt="hyper" height={100} className="mb-3" />
          <div className="text-900 text-3xl font-medium mb-3">Bienvenido a {props.table?.establishment.name}</div>
          <span className="text-600 font-medium line-height-3">Introduce la clave de acceso para acceder a la mesa</span>
        </div>
        <form>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock"></i>
            </span>
            <InputText id="password" type="password" placeholder="Introduce la clave" className={"w-full"} autoComplete='current-password' />
          </div>

          <Button type="submit" label={`Acceder a la mesa ${props.table?.number}`} className="w-full mt-3" />
        </form>
      </div>
    </div>
  )
}
