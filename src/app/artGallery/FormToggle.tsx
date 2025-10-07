"use client";

export default function FormToggle() {
  function openForm() {
    const form = document.getElementById("submitForm");
    if (form) {
      form.style.display = form.style.display === "none" ? "flex" : "none";
    }
  }

  return (
    <p>
      Submit your own artwork via{" "}
      <button
        type="button"
        onClick={openForm}
        className="text-blue-500 underline cursor-pointer"
      >
        this form
      </button>
    </p>
  );
}