export interface Service {
    id: number;
    name: string;
    description: string;
    depedensOnArea: number | null;
    featuredImage: CleanImage;
    images: CleanImage[];
    price: number;
    time: number;
}

export interface CleanImage {
    id: number;
    filename: string;
    url: string;
    alt: string;
}