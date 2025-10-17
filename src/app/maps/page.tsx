import mapsData from "./maps.json";
import MapsClient from "./mapsclient";

interface MapFile {
  url: string;
  filename: string;
}

const typedMapsData = mapsData as Record<string, MapFile[]>;

export default function MapsPage() {
  return <MapsClient data={typedMapsData} />;
}