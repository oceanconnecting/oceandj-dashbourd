import { Navbar } from "@/components/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="w-full py-6 px-4 sm:px-8">{children}</div>
    </div>
  );
}
