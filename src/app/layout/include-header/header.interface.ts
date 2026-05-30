interface MenuItem {
    title: string;
    link: string;
    font_icon: string;
    all_active_menus: { title: string; link: string }[];
    order_by?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface HeaderProps {
    data: {
        header_menu: { menu: [{ all_active_menus: MenuItem[] }] };
    };
    site: {
        site_logo_path: string;
        title: string;
        site_logo_scrolled?: string;
    };
}