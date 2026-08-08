"use client";

import dynamic from "next/dynamic";
import type { ElementType } from "react";
import { useEditor } from "@/components/editor/EditorProvider";

const EditableIconBoxActive = dynamic(
  () =>
    import("@/components/editor/EditableIconBoxActive").then(
      (m) => m.EditableIconBoxActive
    ),
  { ssr: false }
);

type EditableIconBoxProps = {
  contentKey: string;
  sizeKey: string;
  iconUrl?: string;
  iconSize?: number;
  FallbackIcon: ElementType;
  alt: string;
  help?: string;
  minSize?: number;
  maxSize?: number;
};

function StaticIconBox({
  iconUrl = "",
  iconSize = 22,
  FallbackIcon,
  alt,
}: Pick<
  EditableIconBoxProps,
  "iconUrl" | "iconSize" | "FallbackIcon" | "alt"
>) {
  const box = iconSize + 20;
  return (
    <div
      className="rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0"
      style={{ width: box, height: box }}
    >
      {iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconUrl}
          alt={alt}
          className="w-full h-full object-contain p-1.5"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <FallbackIcon size={iconSize} strokeWidth={1.5} />
      )}
    </div>
  );
}

export function EditableIconBox(props: EditableIconBoxProps) {
  const { enabled } = useEditor();
  if (!enabled) {
    return (
      <StaticIconBox
        iconUrl={props.iconUrl}
        iconSize={props.iconSize}
        FallbackIcon={props.FallbackIcon}
        alt={props.alt}
      />
    );
  }
  return <EditableIconBoxActive {...props} />;
}
