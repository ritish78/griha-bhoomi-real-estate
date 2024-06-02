import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

export type Filter = {
  value: string;
  label: string;
};

export function FilterList({
  setIsOpen,
  setSelectedFilter,
  withCommandInput = false,
  withCommandText,
  toFilter
}: {
  setIsOpen: (open: boolean) => void;
  setSelectedFilter: (status: Filter | null) => void;
  withCommandInput?: boolean;
  withCommandText?: string;
  toFilter: Filter[];
}) {
  return (
    <Command>
      {withCommandInput ? (
        <CommandInput placeholder={`${withCommandText ? withCommandText : "Filter..."}`} />
      ) : null}
      <CommandList>
        {withCommandInput ? <CommandEmpty>No results found.</CommandEmpty> : null}
        <CommandGroup>
          {toFilter.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={(value) => {
                setSelectedFilter(toFilter.find((priority) => priority.value === value) || null);
                setIsOpen(false);
              }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
