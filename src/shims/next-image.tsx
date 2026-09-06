import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  quality?: number;
  priority?: boolean;
  unoptimized?: boolean;
  placeholder?: string;
  blurDataURL?: string;
  sizes?: string;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
  { src, alt, width, height, fill, className = '', style, priority, unoptimized, quality, placeholder, blurDataURL, sizes, ...rest },
  ref
) {
  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(fill
      ? {
          position: 'absolute',
          height: '100%',
          width: '100%',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          objectFit: (style?.objectFit as any) || 'cover',
        }
      : {}),
  };

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={combinedStyle}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      {...rest}
    />
  );
});

export default Image;
