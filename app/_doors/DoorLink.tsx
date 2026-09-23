"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useDoorNavigate } from "./DoorTransition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * A `next/link` that runs the sliding-door transition instead of navigating
 * immediately. It stays a real anchor, so prefetching, middle-click, ctrl-click
 * and "open in new tab" all keep working -- only an unmodified left click is
 * intercepted.
 */
export default function DoorLink({ href, onClick, ...rest }: Props) {
  const navigate = useDoorNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!navigate || event.defaultPrevented) return;
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
