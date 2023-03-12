import React from 'react'
import './TopMenu.scss';

export function TopMenu() {
  return (
    <div className="layout-topbar">
      <div to="/" className="layout-topbar-logo">
        <img src="https://res.cloudinary.com/djwjh0wpw/image/upload/v1678621782/favicon_agaioz.png" alt="logo" />
        <span>PANEL DE CONTROL</span>
      </div>

      <button type="button" className="p-link  layout-menu-button layout-topbar-button" >
        <i className="pi pi-bars" />
      </button>

      <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" >
        <i className="pi pi-ellipsis-v" />
      </button>

      <ul className="layout-topbar-menu lg:flex origin-top">
        <li>
          <button className="p-link layout-topbar-button">
            <i className="pi pi-calendar" />
            <span>Events</span>
          </button>
        </li>
        <li>
          <button className="p-link layout-topbar-button">
            <i className="pi pi-cog" />
            <span>Settings</span>
          </button>
        </li>
        <li>
          <button className="p-link layout-topbar-button">
            <i className="pi pi-user" />
            <span>Profile</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
