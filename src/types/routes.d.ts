export interface Route {
    href: string,
    title?: string,
    menuLabel: string,
    breadcrumbLabel?: string
}

export interface Submenu {
    href: string,
    label: string,
    active: boolean
}

export interface Menu {
    href: string,
    label: string,
    active: boolean,
    icon: LucideIcon,
    submenus: Submenu[]
}

export interface GroupMenu {
    groupLabel: string,
    menus: Menu[]
}
