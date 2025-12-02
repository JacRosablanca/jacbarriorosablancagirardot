'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

// Recursive types for multi-level navigation
interface NavLink {
    href: string;
    text: string;
    dropdown?: undefined;
}

interface NavDropdown {
    text: string;
    href?: string; // Allow dropdowns to also be links
    dropdown: (NavLink | NavDropdown)[];
}

type NavItem = NavLink | NavDropdown;

export default function Nav() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [userType, setUserType] = useState<string | null>(null);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const router = useRouter();

    // Efecto para verificar el estado de la sesión al cargar el componente
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const nombreUsuario = localStorage.getItem("nombre");
            const tipoUsuario = localStorage.getItem("tipousuario");
            if (nombreUsuario && tipoUsuario) {
                setIsLoggedIn(true);
                setUserName(nombreUsuario);
                setUserType(tipoUsuario);
            } else {
                setIsLoggedIn(false);
                setUserName(null);
                setUserType(null);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("nombre");
        localStorage.removeItem("usuario");
        localStorage.removeItem("tipousuario");
        setIsLoggedIn(false);
        setUserName(null);
        setUserType(null);
        router.push("/ingresar");
    };

    const handleLinkClick = (href: string) => {
        setMenuAbierto(false);
        setActiveDropdown([]);
        setIsUserDropdownOpen(false); // Cierra el menú de usuario al navegar
        router.push(href);
    };

    const navLinks: NavItem[] = [
        { href: "/", text: "Inicio" },
        {
            text: "Presidencia",
            href: "/presidencia",
            dropdown: [
                {
                    text: "Proyectos",
                    href: "/presidencia/proyectos",
                    dropdown: undefined
                },
                {
                    text: "Gestiones Realizadas",
                    href: "/presidencia/gestiones-realizadas",
                    dropdown: undefined
                },
                {
                    text: "Plan de desarrollo 2022-2026",
                    href: "/presidencia/plan-desarrollo",
                    dropdown: [
                        { href: "/presidencia/pdcc-2022-2026", text: "Plan de Desarrollo Comunal y Comunitario 2022-2026" },
                        { href: "/presidencia/plan-accion/2022", text: "Plan de Acción 2022" },
                        { href: "/presidencia/plan-accion/2023", text: "Plan de Acción 2023" },
                        { href: "/presidencia/plan-accion/2024", text: "Plan de Acción 2024" },
                        { href: "/presidencia/plan-accion/2025", text: "Plan de Acción 2025" },
                        { href: "/presidencia/plan-accion/2026", text: "Plan de Acción 2026" },
                    ]
                },
                {
                    text: "Citación a",
                    dropdown: [
                        { href: "/presidencia/citacion/asamblea-general", text: "Asamblea General de Afiliados" },
                        { href: "/presidencia/citacion/reunion-directivos", text: "Reunión de Directivos y Dignatarios" },
                        { href: "/presidencia/citacion/asamblea-residentes", text: "Asamblea de Residentes" },
                    ]
                },
                {
                    text: "Actos Administrativos",
                    dropdown: [
                        { href: "/presidencia/actos/ordenacion-gasto", text: "Ordenacion del Gasto" },
                        { href: "/presidencia/actos/resoluciones", text: "Resoluciones" },
                        { href: "/presidencia/actos/informes", text: "Informes y Rendición de Cuentas" },
                        { href: "/presidencia/actos/constancias-residencia", text: "Constancias de Residencia" },
                        { href: "/presidencia/actos/comunicados", text: "Comunicados" },
                        { href: "/presidencia/actos/circulares", text: "Circulares" },
                        { href: "/presidencia/actos/acuerdos", text: "Acuerdos" },
                    ]
                },
            ],
        },
        {
            text: "Vicepresidencia",
            href: "/vicepresidencia",
            dropdown: [
                { href: "/vicepresidencia/informes", text: "Informes de Gestión" },
                {
                    text: "Comisiones de Trabajo",
                    dropdown: [
                        { href: "/vicepresidencia/comisiones-de-trabajo/bienestar", text: "Comisión de Bienestar y Participación Comunitaria" },
                        { href: "/vicepresidencia/comisiones-de-trabajo/desarrollo-social", text: "Comisión de Desarrollo Social Comunitario" },
                        { href: "/vicepresidencia/comisiones-de-trabajo/desarrollo-urbano", text: "Comisión de Desarrollo Urbano y Medio Ambiente" },
                    ]
                },
            ]
        },
        {
            text: "Tesorería",
            href: "/tesoreria",
            dropdown: [
                // Aquí está el nuevo enlace a la página de donaciones
                { href: "/tesoreria/donaciones", text: "Donaciones" },
            ]
        },
        { href: "/secretaria", text: "Secretaría" },
        {
            text: "Fiscal",
            href: "/fiscal",
            dropdown: [
                { href: "/fiscal/informes", text: "Informes" },
                { href: "/fiscal/denuncias", text: "Denuncias" },
            ]
        },
        {
            text: "Delegación",
            href: "/delegacion",
            dropdown: [
                { href: "/delegacion/informes-asojuntas", text: "Informes Asojuntas" },
            ]
        },
        {
            text: "Comisión de Convivencia",
            href: "/comision-convivencia",
            dropdown: [
                { href: "/comision-convivencia/procesos-investigativos", text: "Procesos Investigativos" },
                { href: "/comision-convivencia/procesos-declarativo", text: "Procesos Declarativo" },
                { href: "/comision-convivencia/actas", text: "Actas" },
                { href: "/comision-convivencia/correspondencia", text: "Correspondencia" },
                { href: "/comision-convivencia/accion-de-tutelas", text: "Acción de Tutelas" },
            ],
        },
    ];

    // Logic to handle clicks for both desktop and mobile menus
    const handleDropdownClick = (text: string) => {
        setActiveDropdown(prev => {
            if (prev.includes(text)) {
                const index = prev.indexOf(text);
                return prev.slice(0, index);
            }
            return [...prev, text];
        });
    };

    const isDropdownActive = (text: string) => {
        return activeDropdown.includes(text);
    };

    const renderMenuItem = (item: NavLink | NavDropdown, isNested: boolean = false) => {
        if (item.dropdown) {
            const isOpen = isDropdownActive(item.text);
            return (
                <div key={item.text} className={`relative z-20 ${isNested ? 'w-full' : ''}`}>
                    <button
                        onClick={() => handleDropdownClick(item.text)}
                        className={`w-full flex justify-between items-center px-2 py-1 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${isNested ? '' : 'font-semibold'}`} // Reducido px y py
                    >
                        {item.text}
                        <span className="ml-1 text-xs">▶</span> {/* Reducido ml */}
                    </button>
                    {isOpen && (
                        <div className={`absolute z-30 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ${isNested ? 'top-0 left-full ml-1' : 'top-full mt-1'}`}> {/* Reducido w y mt */}
                            {item.dropdown.map(nestedItem => renderMenuItem(nestedItem, true))}
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <Link
                    key={item.href}
                    href={item.href!}
                    className="block w-full px-2 py-1 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" // Reducido px y py
                    onClick={(e) => { e.preventDefault(); handleLinkClick(item.href!); }}
                >
                    {item.text}
                </Link>
            );
        }
    };

    const renderMobileMenuItem = (item: NavLink | NavDropdown) => {
        if (item.dropdown) {
            const isOpen = isDropdownActive(item.text);
            return <div key={item.text} className="z-10">
                    <button onClick={() => handleDropdownClick(item.text)}
                        className="w-full text-left font-semibold hover:text-blue-700 dark:hover:text-blue-300 flex justify-between items-center"
                    >

                        {item.text}
                        <span>{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                        <div className="pl-3 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700"> {/* Reducido pl y mt */}
                            {item.href && <a href={item.href} onClick={(e) => { e.preventDefault(); handleLinkClick(item.href!); }} className="block px-1 py-0.5 font-semibold hover:text-blue-700 dark:hover:text-blue-300">Página Principal</a>} {/* Reducido px y py */}
                            {item.dropdown.map(nestedItem => renderMenuItem(nestedItem, true))}
                        </div>
                    )}</div>;
        } else {
            return (
                <a
                    key={item.href}
                    href={item.href!}
                    className="block font-semibold hover:text-blue-700 dark:hover:text-blue-300"
                    onClick={(e) => { e.preventDefault(); handleLinkClick(item.href!); }}
                >
                    {item.text}
                </a>
            );
        }
    };

    return (
        <nav className="w-full bg-white dark:bg-[#23232a] border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
            {/* Contenedor principal del nav, con ancho limitado */}
            <div className="max-w-4xl mx-auto px-4"> {/* **Cambio clave aquí: max-w-4xl para menos ancho** */}
                <div className="flex justify-between items-center h-12">
                    {/* Contenedor para los enlaces de navegación principales */}
                    <div className="hidden md:flex space-x-4 text-sm items-center"> {/* **Cambio clave aquí: space-x-4 para menos espaciado** */}
                        {navLinks.map((link) => (
                            <div
                                key={link.text}
                                className="relative z-20"
                            >
                                {link.dropdown ? (
                                    <button
                                        onClick={() => handleDropdownClick(link.text)}
                                        className="font-semibold hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none"
                                    >
                                        {link.text}
                                    </button>
                                ) : (
                                    <Link
                                        href={link.href}
                                        className="font-semibold hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none"
                                        onClick={() => handleLinkClick(link.href)}
                                    >
                                        {link.text}
                                    </Link>
                                )}
                                {link.dropdown && isDropdownActive(link.text) && (
                                    <div className="absolute z-30 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1"> {/* Reducido w y mt */}
                                        {link.dropdown.map(item => renderMenuItem(item, true))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contenedor para el mensaje de bienvenida o botones de afiliación/ingreso */}
                    <div className="hidden md:flex items-center space-x-2"> {/* **Cambio clave aquí: space-x-2 para menos espaciado** */}
                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="text-green-500 font-bold hover:text-green-400 px-2 py-1 rounded-md text-sm" // Reducido px y py, y el tamaño de texto
                                >
                                    Bienvenido, {userName}
                                </button>
                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"> {/* Reducido w y mt */}
                                        <ul className="py-1"> {/* Reducido py */}
                                            <li>
                                                <Link
                                                    href={`/${userType}/${localStorage.getItem("usuario")}/perfil`}
                                                    className="block px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm" // Reducido px y py, y el tamaño de texto
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    Mi perfil
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/${userType}/${localStorage.getItem("usuario")}/panel`}
                                                    className="block px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm" // Reducido px y py, y el tamaño de texto
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    Panel
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-3 py-1.5 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm" // Reducido px y py, y el tamaño de texto
                                                >
                                                    Cerrar sesión
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-2"> {/* **Cambio clave aquí: space-x-2 para menos espaciado** */}
                                <Link href="/afiliate" className="px-2 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Afíliate</Link> {/* Reducido px y py */}
                                <Link href="/ingresar" className="px-2 py-1 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Ingresar</Link> {/* Reducido px y py */}
                            </div>
                        )}
                    </div>

                    {/* Botón de Menú Hamburguesa para móvil */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            aria-expanded={menuAbierto}
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            {menuAbierto ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Menú móvil */}
            {menuAbierto && (
                <div className="md:hidden px-3 pb-4 text-sm space-y-1 bg-white dark:bg-[#23232a] border-t border-gray-200 dark:border-gray-700 z-30"> {/* Reducido px, pb, space-y */}
                    {isLoggedIn && (
                        <div className="py-1 border-b border-gray-200 dark:border-gray-700"> {/* Reducido py */}
                            <span className="block font-bold text-green-500 px-2">Bienvenido, {userName}</span>
                            <Link href={`/${userType}/${localStorage.getItem("usuario")}/perfil`} className="block px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">Mi perfil</Link> {/* Reducido px y py */}
                            <Link href={`/${userType}/${localStorage.getItem("usuario")}/panel`} className="block px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">Panel</Link> {/* Reducido px y py */}
                            <button onClick={handleLogout} className="w-full text-left px-3 py-1 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">Cerrar sesión</button> {/* Reducido px y py */}
                        </div>
                    )}
                    {navLinks.map(renderMobileMenuItem)}
                    {!isLoggedIn && ( /* Añadir los enlaces de invitado en el menú móvil si no está logueado */
                        <div className="pt-1 border-t border-gray-200 dark:border-gray-700"> {/* Reducido pt */}
                            <Link href="/afiliate" className="block font-semibold hover:text-blue-700 dark:hover:text-blue-300 px-2 py-1">Afíliate</Link> {/* Reducido px y py */}
                            <Link href="/ingresar" className="block font-semibold hover:text-blue-700 dark:hover:text-blue-300 px-2 py-1">Ingresar</Link> {/* Reducido px y py */}
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}