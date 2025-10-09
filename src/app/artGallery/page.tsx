import SubmitArtwork from "@/components/artSubmit";
import ServeGallery from "./serveGallery";
import FormToggleNotice from "./FormToggle";
import ArtLightbox from "./artLightbox";

export const dynamic = "force-dynamic"

export default function ArtGallery() {
  return (
    <div className="flex flex-col items-center">
      <h1>Art Gallery</h1>
      <ArtLightbox />
      <SubmitArtwork />
      <FormToggleNotice />
      <ServeGallery />
    </div>
  );
}