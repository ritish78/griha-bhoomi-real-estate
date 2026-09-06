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
    <div className="flex w-full flex-col gap-6 md:w-1/2">
      <div className="space-y-4">
        <div>
          <h2 className="line-clamp-2 font-bold text-3xl mb-3 leading-tight">{property.title}</h2>
          <div className="flex mr-auto gap-x-2 items-start mb-3">
            <Icons.mapPin className="size-5 mt-0.5 flex-shrink-0 text-muted-foreground"></Icons.mapPin>
            <span className="text-muted-foreground text-base font-medium break-words leading-relaxed">
              {property.street && `${property.street}, `}
              {property.municipality && `${property.municipality}, `}
              {property.city && `${property.city}, `}
              {property.district && `${property.district}`}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-foreground font-bold text-3xl">
            ${formatPrice(property.price)} 
            {property.toRent && <span className="text-xl text-muted-foreground font-normal"> per month</span>}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="default" className="font-medium px-3 py-1.5">
              {property.status}
            </Badge>
            <div className="flex items-center gap-1.5">
              <Icons.eye className="size-4" />
              <span>{property.views} {property.views > 1 ? "views" : "view"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.calendar className="size-4" />
              <span>Posted {formatListedAtDate(property.listedAt)} ago</span>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-2" />
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
