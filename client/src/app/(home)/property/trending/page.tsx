import TrendingPageSection from "./trending-page-section";

export interface TrendingPageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function TrendingPage(props: TrendingPageProps) {
  return (
    <div className="container bg-slate-50 dark:bg-transparent pb-8">
      <TrendingPageSection {...props} />
    </div>
  );
}
