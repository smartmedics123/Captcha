export function createProductSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") 
    .replace(/^-+|-+$/g, "");    
}
