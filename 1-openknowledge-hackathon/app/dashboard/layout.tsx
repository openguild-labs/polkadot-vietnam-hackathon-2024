export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="px-4">
      <div className="">{children}</div>
    </section>
  );
}
