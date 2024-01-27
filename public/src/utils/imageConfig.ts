export interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export type ImageLoaderFunction = (params: ImageLoaderParams) => string;

export const imageLoader: ImageLoaderFunction = ({ src, width, quality }) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_API_URL || '';
  return `${baseUrl}${src}?w=${width}&q=${quality || 75}`;
};

