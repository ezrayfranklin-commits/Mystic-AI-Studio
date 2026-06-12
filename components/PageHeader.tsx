export function PageHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-white/10 bg-mystic-grid bg-[size:72px_72px]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {eyebrow ? (
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brass">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-stone-300 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
