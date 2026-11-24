const BASE_URL = "https://swagly.in/api";

export const getHomeData = async () => {
  const response = await fetch(`${BASE_URL}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch home data");
  }

  return response.json();
};

export const getProductDetails = async (slug: string) => {
  const response = await fetch(`${BASE_URL}/product/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }

  return response.json();
};

export const getCategoryProducts = async (
  id: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await fetch(
    `${BASE_URL}/category/${id}?page=${page}&limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category products");
  }

  return response.json();
};
