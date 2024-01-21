export interface ImageLoaderParams {
    src: string;
    width: number;
    quality?: number;
  }
  
  export type ImageLoaderFunction = (params: ImageLoaderParams) => string;
  
  export const imageLoader: ImageLoaderFunction = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };