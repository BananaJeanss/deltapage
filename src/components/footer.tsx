export default function FooterComp() {
  return (
    <footer className="bg-gray-950 text-white text-center p-4 mt-8 w-full">
      <p>
        {new Date().getFullYear()} Deltapage | Open-Source on{" "}
        <a href="https://github.com/BananaJeanss/deltapage" target="_blank">GitHub</a>{" "}
      </p>
    </footer>
  );
}
