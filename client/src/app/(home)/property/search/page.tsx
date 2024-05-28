import SearchFilter from "./_components/search-filter";

export default async function SearchPropertyPage() {
  return (
    <div className="container bg-slate-50 dark:bg-transparent pb-8 flex flex-col space-y-8">
      <div>
        <SearchFilter />
        <p>Search Page!</p>
      </div>
    </div>
  );
}
