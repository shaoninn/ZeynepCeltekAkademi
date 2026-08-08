"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEditor } from "@/components/editor/EditorProvider";
import {
  isLocalPublicPath,
  toWebpSrc,
  toWebpSrcMobile,
} from "@/lib/image-optimize";

const EditableImageActive = dynamic(
  () =>
    import("@/components/editor/EditableImageActive").then(
      (m) => m.EditableImageActive
    ),
  { ssr: false }
);

type EditableImageProps = {
  contentKey: string;
  value: string;
  fallback?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  help?: string;
  aspectClass?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export function PublicImg({
  src,
  alt,
  imgClassName,
  fill,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  imgClassName: string;
  fill: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const webp = toWebpSrc(src);
  const webpSm = toWebpSrcMobile(src);
  const usePicture = isLocalPublicPath(src) && Boolean(webpSm || webp !== src);

  if (usePicture) {
    const className = fill
      ? `absolute inset-0 h-full w-full ${imgClassName}`
      : imgClassName;
    if (webpSm) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={webpSm}
          srcSet={`${webpSm} 640w, ${webp} 1200w`}
          sizes={sizes || "(max-width: 640px) 100vw, 50vw"}
          alt={alt}
          width={1200}
          height={1200}
          className={className}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={webp}
        alt={alt}
        width={1200}
        height={1200}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={webp}
      alt={alt}
      fill
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      sizes={sizes || "100vw"}
      className={imgClassName}
      loading={priority ? undefined : "lazy"}
    />
  );
}

export function EditableImage(props: EditableImageProps) {
  const { enabled } = useEditor();
  const src = props.value || props.fallback || "";
  const imgClassName = props.imgClassName || "object-cover";
  const aspectClass = props.aspectClass || "aspect-[16/9]";

  if (!enabled) {
    if (!src) return null;
    if (props.fill) {
      return (
        <PublicImg
          src={src}
          alt={props.alt}
          imgClassName={imgClassName}
          fill
          priority={props.priority}
          sizes={props.sizes || "(max-width: 1024px) 100vw, 50vw"}
        />
      );
    }
    return (
      <div
        className={`relative overflow-hidden ${aspectClass} ${props.className || ""}`}
      >
        <PublicImg
          src={src}
          alt={props.alt}
          imgClassName={imgClassName}
          fill
          priority={props.priority}
          sizes={props.sizes || "100vw"}
        />
      </div>
    );
  }

  return <EditableImageActive {...props} />;
}
