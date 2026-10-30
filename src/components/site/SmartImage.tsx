import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";
import { resolveImage } from "@/lib/assets";
import { cn } from "@/lib/utils";

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** `asset:<key>` token or URL */
  src: string | undefined;
  alt: string;
  /** Classes for the fallback box (defaults to the img className) */
  fallbackClassName?: string;
}

/** `<img>` that resolves bundled asset tokens and shows a branded fallback if loading fails. */
export function SmartImage({
  src,
  alt,
  className,
  fallbackClassName,
  loading = "lazy",
  ...rest
}: SmartImageProps) {
  const resolved = resolveImage(src);
  const [failed, setFailed] = useState(!resolved);

  useEffect(() => setFailed(!resolved), [resolved]);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-navy to-dark text-gold/70",
          fallbackClassName ?? className,
        )}
      >
        <ImageOff className="size-8" aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
