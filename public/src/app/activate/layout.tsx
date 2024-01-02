export const metadata = {
  title: 'ZoeX',
  description:
    'ZoeX - Apuestas/Rifas',
};

export default function ActivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {children}
    </section>
  );
}

