import path from 'path'
import fs from 'fs/promises'
export const __dirname = import.meta.dirname

export async function fileExists (route, imageName) {
  try {
    const imagePath = path.join(route, imageName)
    await fs.access(imagePath)
    return true
  } catch {
    return false
  }
}
