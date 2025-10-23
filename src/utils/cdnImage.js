export const getCloudinaryUrl = (publicId, width = 800) => {
  if (!publicId || typeof publicId !== "string") return "";
  return `https://res.cloudinary.com/dc5nqer3i/image/upload/w_${width},q_auto,f_auto/${publicId}`;
};
