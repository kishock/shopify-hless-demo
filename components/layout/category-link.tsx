"use client";

import clsx from "clsx";
import { createUrl } from "lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function CategoryLink({
  categoryKey,
  label,
}: {
  categoryKey?: string;
  label: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const active = categoryKey ? activeCategory === categoryKey : !activeCategory;
  const nextParams = new URLSearchParams(searchParams.toString());

  if (categoryKey) {
    nextParams.set("category", categoryKey);
  } else {
    nextParams.delete("category");
  }

  nextParams.delete("q");

  return (
    <Link
      href={createUrl(
        pathname === "/search" ? pathname : "/search",
        nextParams,
      )}
      prefetch={true}
      className={clsx(
        "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
        {
          "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-neutral-950":
            active,
          "border-neutral-200 bg-white text-neutral-700 hover:border-emerald-600 hover:text-emerald-700 dark:border-neutral-600 dark:bg-zinc-800 dark:text-neutral-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400":
            !active,
        },
      )}
    >
      {label}
    </Link>
  );
}
