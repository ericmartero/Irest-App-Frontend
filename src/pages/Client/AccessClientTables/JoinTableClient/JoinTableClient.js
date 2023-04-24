import React from 'react';
import { Button } from 'primereact/button';

export function JoinTableClient() {

  return (
    <div className="flex align-items-center justify-content-center h-screen">
      <div className="p-4 w-full lg:w-6 mx-auto">s
        <div className="text-center mb-5">
          <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1678622048/irest-logo-white-copy_mlspdo.png" alt="hyper" height={100} className="mb-3" />
          <div className="text-900 text-3xl font-medium mb-3">Bienvenido a iRest</div>
          <span className="text-600 font-medium line-height-3">Pulsa el botón para acceder a la mesa número</span>
        </div>

          <Button type="submit" label="Acceder a la mesa" className="w-full mt-3" />
      </div>
    </div>
  )
}
