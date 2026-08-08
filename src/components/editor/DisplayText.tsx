import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { SiteLink } from "@/components/ui/SiteLink";
import { parseTextStyle, textStyleToCss } from "@/lib/text-style";

type DisplayTextProps = {
  value: string;
  as?: ElementType;
  className?: string;
  block?: boolean;
  children?: ReactNode;
  textStyle?: string;
  style?: CSSProperties;
  linkHref?: string;
  linkClassName?: string;
};

/** Public (non-editor) text — no editor hooks, panels, or lucide. */
export function DisplayText({
  value,
  as: Tag = "span",
  className,
  children,
  textStyle: textStyleRaw = "",
  style: styleProp,
  linkHref,
  linkClassName,
}: DisplayTextProps) {
  const mergedStyle: CSSProperties = {
    ...textStyleToCss(parseTextStyle(textStyleRaw)),
    ...styleProp,
  };
  const textContent = children ?? value;

  if (linkHref) {
    return (
      <SiteLink href={linkHref} className={linkClassName}>
        <Tag className={className} style={mergedStyle}>
          {textContent}
        </Tag>
      </SiteLink>
    );
  }

  return (
    <Tag className={className} style={mergedStyle}>
      {textContent}
    </Tag>
  );
}
