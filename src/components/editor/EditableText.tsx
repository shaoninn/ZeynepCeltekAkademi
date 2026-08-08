"use client";

import dynamic from "next/dynamic";
import { useEditor } from "@/components/editor/EditorProvider";
import { DisplayText } from "@/components/editor/DisplayText";
import type { CSSProperties, ElementType, ReactNode } from "react";

const EditableTextActive = dynamic(
  () =>
    import("@/components/editor/EditableTextActive").then(
      (m) => m.EditableTextActive
    ),
  { ssr: false }
);

type EditableTextProps = {
  contentKey: string;
  value: string;
  as?: ElementType;
  className?: string;
  help?: string;
  multiline?: boolean;
  block?: boolean;
  children?: ReactNode;
  editField?: "content" | "title";
  pairedContent?: string;
  textStyle?: string;
  style?: CSSProperties;
  linkHref?: string;
  linkClassName?: string;
};

/**
 * Public path: DisplayText only (no editor panel chunk).
 * /duzenle: dynamically loads EditableTextActive.
 */
export function EditableText(props: EditableTextProps) {
  const { enabled } = useEditor();
  if (!enabled) {
    return (
      <DisplayText
        value={props.value}
        as={props.as}
        className={props.className}
        block={props.block}
        textStyle={props.textStyle}
        style={props.style}
        linkHref={props.linkHref}
        linkClassName={props.linkClassName}
      >
        {props.children}
      </DisplayText>
    );
  }
  return <EditableTextActive {...props} />;
}
