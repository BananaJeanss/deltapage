import spritesData from "./sprites.json";
import SpritesClient from "./spritesclient";

const typedSpritesData = spritesData as Record<string, Record<string, string[]>>;

export default function SpritesPage() {
  return <SpritesClient data={typedSpritesData} />;
}