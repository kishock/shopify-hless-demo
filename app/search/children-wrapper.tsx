"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Fragment } from "react";

// Ensure children are re-rendered when the route or search params change.
export default function ChildrenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  return <Fragment key={routeKey}>{children}</Fragment>;
}
