import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProducts = async (page , limit, searchTerm = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: {
        type: "full",
        page,
        limit,
        search: searchTerm,
      },
      headers: {
        'x-api-key': import.meta.env.VITE_API_SECURITY_KEY,
      }
    });

    if (response.data && response.data.data) {
      console.log(response);

      const products = response.data.data.data.map((product) => {
        const baseImageUrl = API_BASE_URL.replace("/api", "");

        // Ensure images array is processed correctly
        const images = product.images?.map((img) =>
          img.imageName.startsWith("http")
            ? img.imageName
            : `${API_BASE_URL.replace("/api", "")}/${img.imageName.replace("storage/storage", "storage")}`
        ) || ["https://via.placeholder.com/500"]; // Fallback image
        return {
          id: product.id,
          name: product.title,
          desc: product.description,
          price: `Rs. ${product.price}`,
          thumbnail: product.thumbnail
            ? `${baseImageUrl}/${product.thumbnail}`
            : "https://via.placeholder.com/150", // Fallback thumbnail
          images, // Processed images array
          specification: product.specification || "No specification available",
          usageAndSafety:
            product.usageAndSafety || "No usage and safety information available",
          warnings: product.warnings || "No warnings available",
          additionalInformation:
            product.additionalInformation || "No additional information available",
          precautions: product.precautions || "No precautions provided",
        };
      });

      return {
        products,
        totalPages: response.data.data.last_page || 1,
      };
    }

    return { products: [], totalPages: 0 };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
