/** Ruta a un archivo de public/img respetando la base del sitio (GitHub Pages). */
export const asset = (name: string) => `${import.meta.env.BASE_URL}img/${name}`
