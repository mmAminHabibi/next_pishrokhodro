export function ContentTypeId(content_type_id: number): { title: string, route: string } {
    let res = {title: 'صفحه ', route: 'page'}
    switch (content_type_id) {
        case 67:
            res = {title: 'محتوای سایت', route: 'circular'};
            break;
        case 64:
            res = {title: 'صفحه', route: 'page'};
            break;
        case 65:
            res = {title: 'محصولات', route: 'products'};
            break;
        case 66:
            res = {title: 'دست نوشه', route: 'blogs'};
            break;
    }
    return res
}

export function getContentTypeIdByName(name: 'circular' | 'page' | 'products' | 'blogs'): number {
    switch (name) {
        case 'circular':
            return 67;
        case 'page':
            return 64;
        case 'products':
            return 65;
        case 'blogs':
            return 66;
        default:
            return 0;
    }
}

export function GetItemLink(item: ContentInterface) {
    return `/${ContentTypeId(item.content_type_id).route}/${item.id}/${Slugify(item.title)}`
}

export function Slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0600-\u06FF]/g, c => c)
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}


export function GetImage(filePath: string, typeName: 'image_smaller' | 'image_small' | 'image_normal' | 'image_large' | ''): string {
    if (filePath !== null && filePath !== undefined && typeName !== '') {
        const lastSlashIndex = filePath.lastIndexOf('/');
        return filePath.slice(0, lastSlashIndex) + '/' + typeName + filePath.slice(lastSlashIndex);
    } else {
        return filePath
    }
}