import { useId, useState } from "react";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utlis";
import { Icons } from "./icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "./ui/command";

export default function BuiltYearFilter({
  value,
  onChange,
  disabled = false,
  label = "Built in or after",
  placeholder = "Any year"
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, index) =>
    String(currentYear - index)
  );

  function selectYear(year: string) {
    onChange(year);
    setOpen(false);
  }

  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn("w-full justify-between font-normal", !value && "text-muted-foreground")}
          >
            {value || placeholder}{" "}
            <Icons.upDown aria-hidden="true" className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search year" />

            <CommandList className="max-h-60">
              <CommandEmpty>No year found.</CommandEmpty>

              <CommandGroup>
                <CommandItem value="any-year" onSelect={() => selectYear("")}>
                  <Icons.check
                    aria-hidden="true"
                    className={cn("mr-2 size-4", !value ? "opacity-100" : "opacity-0")}
                  />
                  {placeholder}
                </CommandItem>

                {years.map((year) => (
                  <CommandItem key={year} value={year} onSelect={() => selectYear(year)}>
                    <Icons.check
                      aria-hidden="true"
                      className={cn("mr-2 size-4", value === year ? "opacity-100" : "opacity-0")}
                    />
                    {year}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
