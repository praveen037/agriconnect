// utils/imageUrl.js
export const getImageUrl = (image, type = "product") => {
  if (!image) {
    console.log("DEBUG: No image found, using placeholder");
    return "/placeholder.png";
  }

  // ✅ if already a full URL, just return it
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const baseUrl = "http://localhost:3130";

  if (type === "product") {
    const cleanImage = image.replace(/^\/?uploads\/products\//, "");
    const url = `${baseUrl}/uploads/products/${cleanImage}`;
    console.log("DEBUG: Product image URL generated:", url);
    return url;
  }

  if (type === "query") {
    const cleanImage = image.replace(/^\/?uploads\/project\/queries\//, "");
    const url = `${baseUrl}/uploads/project/queries/${cleanImage}`;
    console.log("DEBUG: Query image URL generated:", url);
    return url;
  }

  const fallback = `${baseUrl}/${image.replace(/^\/+/, "")}`;
  console.log("DEBUG: Fallback image URL:", fallback);
  return fallback;
};
