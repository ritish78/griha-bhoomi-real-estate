import SiteHeader from "@/components/ui/Header/site-header";
import MobileActionBar from "@/components/ui/Header/mobile-action-bar";
import { SiteFooter } from "@/components/ui/footer/site-footer";

interface HomeLayoutProps extends React.PropsWithChildren {}

export default async function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileActionBar />
    </div>
  );
}
