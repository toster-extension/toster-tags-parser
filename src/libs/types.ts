interface Branding<BrandT> {
    _type?: BrandT
}
type Brand<T, BrandT> = T & Branding<BrandT>;

export interface Tag {
    id?: TagId
    name: string
    slug: string
    image: string
}

export type TagId = Brand<number, Tag>;
