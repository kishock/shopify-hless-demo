import { getProductCategories } from "lib/shopify/categories";
import { getProductTypes } from "lib/shopify";
import CategoryLink from "./category-link";

export default async function CategoryMenu() {
  const productTypes = await getProductTypes();
  const categories = getProductCategories(productTypes);

  if (!categories.length) {
    return null;
  }

  return (
    <div className="border-t border-neutral-200/80 px-4 pt-3 pb-5 dark:border-neutral-700/80 lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto pb-1">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          Categories
        </span>
        <CategoryLink label="All" />
        {categories.map((category) => (
          <CategoryLink
            key={category.key}
            categoryKey={category.key}
            label={category.label}
          />
        ))}
      </div>
    </div>
  );
}
