export type ProductCategory = {
  key: string;
  label: string;
  query: string;
};

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  "Graphic shirt": "T-Shirt",
};

const SPECIAL_CATEGORIES: ProductCategory[] = [
  {
    key: "cover",
    label: "Cover",
    query: "cover",
  },
];

function slugifyCategory(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductCategories(
  productTypes: string[],
): ProductCategory[] {
  const mapped = productTypes.map((productType) => ({
    key: slugifyCategory(PRODUCT_TYPE_LABELS[productType] || productType),
    label: PRODUCT_TYPE_LABELS[productType] || productType,
    query: `product_type:'${productType.replace(/'/g, "\\'")}'`,
  }));

  return [...SPECIAL_CATEGORIES, ...mapped];
}

export function getCategoryByKey(
  categoryKey: string | undefined,
  productTypes: string[],
) {
  if (!categoryKey) {
    return undefined;
  }

  return getProductCategories(productTypes).find(
    (category) => category.key === categoryKey,
  );
}
