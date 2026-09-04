export function PageBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="home-desktop-backdrop page-desktop-backdrop pointer-events-none absolute inset-0 hidden lg:block"
      />
      <div
        aria-hidden="true"
        className="home-desktop-grid page-desktop-grid pointer-events-none absolute inset-0 hidden lg:block"
      />
    </>
  );
}
