/* ----- CONFIGURACIÓ CMS ----- */
const CMS_URL = "https://voracms.voradata.cat";
const CMS_PROJECT_SLUG = "aula-gastronomica";
/* ----- RESOLUCIÓ D'IMATGES ----- */
function getVoraMediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return CMS_URL + path;
}

/* ----- PETICIÓ AL CMS (endpoints públics) ----- */
async function getCMSData(endpoint) {
  try {
    const response = await fetch(`${CMS_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching VoraCMS data:", error);
    return null;
  }
}
