import Image from "next/image";
import RecommendedTile from "@/components/recommendedTile";

const recommendedPages = [
  {
    title: "Textbox Generator",
    description: "Customizable UT/DR textbox generator",
    link: "/textbox",
    image: "/textbox.png",
  },
];

export default function Home() {
  return (
    <>
      <div
        className={"py-12 rounded-xl w-3/4 justify-center relative"}
        style={{
          backgroundImage: "url('/castle.webp')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-col items-center z-10">
          <div className="absolute inset-0 flex flex-col align-center bg-black opacity-40 rounded-xl"></div>
          <Image
            src={"/delta.png"}
            width={250}
            height={250}
            alt="Deltapage logo"
            className="relative z-10"
          />
          <p className="text-lg text-center z-10">
            A collection of Deltarune (and Undertale) media and tools.
          </p>
        </div>
      </div>
      <hr className="my-8 w-3/4" />
      <div>
        <h2 className="flex">Recommended Pages</h2>
        <div className="flex flex-wrap flex-row gap-4 justify-center">
          {recommendedPages.map((page) => (
            <RecommendedTile
              key={page.title}
              image={page.image}
              title={page.title}
              description={page.description}
              urllink={page.link}
            />
          ))}
        </div>
      </div>
    </>
  );
}
