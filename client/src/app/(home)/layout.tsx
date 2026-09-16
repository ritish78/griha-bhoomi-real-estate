import SiteHeader from "@/components/ui/Header/site-header";
import { SiteFooter } from "@/components/ui/footer/site-footer";

interface HomeLayoutProps extends React.PropsWithChildren {}

export default async function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
