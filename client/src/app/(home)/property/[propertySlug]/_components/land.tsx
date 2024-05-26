import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCase } from "@/lib/formatCase";
import { formatListedAtDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import { Property } from "@/types/property";

interface LandProps {
  property: Property;
}

export default function Land({ property }: LandProps) {
  return (
    <div className="flex w-full flex-col gap-4 md:w-1/2">
      <div className="space-y-2">
        <h2 className="line-clamp-1 font-bold text-2xl">{property.title}</h2>
        <p className="text-muted-foreground text-base font-medium">
          ${formatPrice(property.price)} {property.toRent && "per month"}
        </p>
        <div className="text-sm text-muted-foreground flex items-center">
          <Badge variant="default" className="mr-4 font-medium px-4 py-1">
            {property.status}
          </Badge>
          <Icons.eye className="mr-2 size-5" />
          {property.views} {property.views > 1 ? "views" : "view"}
          <span className="mx-4"></span>
          <Icons.calendar className="mr-2 size-5" />
          <span>Posted: {formatListedAtDate(property.listedAt)} ago</span>
        </div>
      </div>
      <Separator className="my-1.5" />
      <div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
            <h3 className="font-bold">Land Type</h3>
            <div className="flex items-center">
              <Icons.land className="size-5" />
              <p className="text-muted-foreground ml-2">{formatCase(property.landType || "")}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
            <h3 className="font-bold">Length</h3>
            <div className="flex items-center">
              <Icons.pencilRuler className="size-5" />
              <p className="text-muted-foreground ml-2">{property.length}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
            <h3 className="font-bold">Breadth</h3>
            <div className="flex items-center">
              <Icons.ruler className="size-5" />
              <p className="text-muted-foreground ml-2">{property.breadth}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
            <h3 className="font-bold">Area</h3>
            <div className="flex items-center">
              <Icons.area className="size-5" />
              <p className="text-muted-foreground ml-2">{property.landArea}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
            <h3 className="font-bold">Connected To Road</h3>
            <div className="flex items-center">
              <Icons.road />
              <p className="text-muted-foreground ml-2">
                {property.landConnectedToRoad ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
        {!property.landConnectedToRoad && (
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
              <h3 className="font-bold">Distance to road</h3>
              <div className="flex items-center">
                <Icons.ruler />
                <p className="text-muted-foreground ml-2">{property.landDistanceToRoad} meters</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Separator className="my-1.5" />
      <div className="mb-4">
        <div className="mb-6">
          <h2 className="font-bold text-xl mb-4">Description</h2>
          <p>{property.description}</p>
        </div>
        <div>
          <h2 className="font-bold text-xl mb-4">Close Landmark</h2>
          <div className="flex items-center">
            <Icons.mapPin className="size-5" />
            <p className="ml-3">{property.closeLandmark}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
