import { TruckIcon } from "@heroicons/react/24/outline";
import CartModal from "components/cart/modal";
import CategoryMenu from "components/layout/category-menu";
import ThemeToggle from "components/layout/theme-toggle";
import { getMenu } from "lib/shopify";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <nav className="relative border-b border-neutral-200/80 dark:border-neutral-700/80">
      <div className="flex items-center justify-between p-4 lg:px-6">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-full md:w-1/3">
            <Link
              href="/"
              prefetch={true}
              className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
            >
              <TruckIcon className="h-7 w-7 text-brandBlue" />
              <span className="ml-2 hidden flex-none text-2xl font-extrabold tracking-tighter text-neutral-950 dark:text-neutral-50 md:inline lg:inline">
                Headless<span className="text-brandBlue">DEMO</span>
              </span>
            </Link>
            {menu.length ? (
              <ul className="hidden gap-6 text-sm md:flex md:items-center">
                {menu.map((item: Menu) => (
                  <li key={item.title}>
                    <Link
                      href={item.path}
                      prefetch={true}
                      className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-300 dark:hover:text-white"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="hidden justify-center md:flex md:w-1/3">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          <div className="flex items-center justify-end gap-3 md:w-1/3">
            <ThemeToggle />
            <CartModal />
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <CategoryMenu />
      </Suspense>
    </nav>
  );
}
