"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEditor } from "@/components/editor/EditorProvider";

const EditableSectionShiftActive = dynamic(
  () =>
    import("@/components/editor/EditableSectionShiftActive").then(
      (m) => m.EditableSectionShiftActive
    ),
  { ssr: false }
);

type EditableSectionShiftProps = {
  settingKey: string;
  value?: string;
  children: ReactNode;
  className?: string;
  label?: string;
  min?: number;
  max?: number;
};

export function EditableSectionShift({
  settingKey,
  value = "0",
  children,
  className = "",
  label,
  min,
  max,
}: EditableSectionShiftProps) {
  const { enabled } = useEditor();
  const offset = Number(value) || 0;

  if (!enabled) {
    return (
      <div
        className={className || undefined}
        style={{ marginTop: offset ? offset : undefined }}
      >
        {children}
      </div>
    );
  }

  return (
    <EditableSectionShiftActive
      settingKey={settingKey}
      value={value}
      className={className}
      label={label}
      min={min}
      max={max}
    >
      {children}
    </EditableSectionShiftActive>
  );
}
