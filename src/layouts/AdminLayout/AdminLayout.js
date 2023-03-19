import React, { useState, useEffect, useRef } from 'react';
import PrimeReact from 'primereact/api';
import classNames from 'classnames';
import { Tooltip } from 'primereact/tooltip';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { LoginAdmin } from '../../pages/Admin';
import { TopMenu, SideMenu } from '../../components/Admin';
import './AdminLayout.scss';

export function AdminLayout(props) {

    const { children } = props;
    const { auth } = useAuth();

    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const layoutMode = 'static';
    const layoutColorMode = 'light';
    const inputStyle = 'outlined';

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            setStaticMenuInactive((prevState) => !prevState);
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    let menu;

    if (auth?.me.user.roles.includes('admin') || auth?.me.user.roles.includes('boss')) {
        menu = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin' },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-id-card', to: '/admin/users' },
                ]
            }
        ];
    }

    else {
        menu = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin' },
                ]
            }
        ];
    }

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'layout-theme-light': layoutColorMode === 'light'
    });

    if (!auth) return <LoginAdmin />;

    return (
        <div className={wrapperClass} onClick={onWrapperClick} >
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <TopMenu onToggleMenuClick={onToggleMenuClick} mobileTopbarMenuActive={mobileTopbarMenuActive}
                onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />
            <div className="layout-sidebar">
                <SideMenu model={menu} onMenuItemClick={onMenuItemClick} />
            </div>
            <div className="layout-main-container">
                <div className="layout-main">
                    {children}
                </div>
            </div>
        </div>
    )
}
