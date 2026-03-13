import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { getCategoryByKey } from "lib/shopify/categories";
import { getProductTypes, getProducts } from "lib/shopify";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

function buildSearchQuery({
  searchValue,
  categoryQuery,
}: {
  searchValue?: string;
  categoryQuery?: string;
}) {
  const filters = [] as string[];

  if (searchValue?.trim()) {
    filters.push(searchValue.trim());
  }

  if (categoryQuery?.trim()) {
    filters.push(categoryQuery.trim());
  }

  return filters.join(" AND ") || undefined;
}

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const {
    sort,
    q: searchValue,
    category,
  } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const productTypes = await getProductTypes();
  const activeCategory = getCategoryByKey(category, productTypes);
  const products = await getProducts({
    sortKey,
    reverse,
    query: buildSearchQuery({
      searchValue,
      categoryQuery: activeCategory?.query,
    }),
  });
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {activeCategory ? (
        <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
          Category:{" "}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {activeCategory.label}
          </span>
        </p>
      ) : null}
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match "
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {!searchValue && activeCategory ? (
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          {products.length === 0
            ? "No products found in this category."
            : `Showing ${products.length} ${resultsText} in this category.`}
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
