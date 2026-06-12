import type { ReactNode } from "react";

export function ReadingCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="panel rounded-lg p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-stone-300">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
