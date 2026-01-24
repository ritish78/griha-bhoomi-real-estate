import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatBuiltDate, formatListedAtDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import { Property } from "@/types/property";

interface HouseProps {
  property: Property;
}

export default function House({ property }: HouseProps) {
  return (
    <div className="flex w-full flex-col gap-6 md:w-1/2">
      <div className="space-y-4">
        <div>
          <h2 className="line-clamp-2 font-bold text-2xl mb-3 leading-tight">{property.title}</h2>
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
          <p className="text-foreground font-bold text-2xl">
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
            <h3 className="font-bold">House Type</h3>
            <div className="flex items-center">
              {property.houseType === "House" ||
              property.houseType === "Bungalow" ||
              property.houseType === "Villa" ? (
                <Icons.house className="size-5" />
              ) : (
                <Icons.building />
              )}
              <p className="text-muted-foreground ml-2">{property.houseType}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
            <h3 className="font-bold">Rooms</h3>
            <div className="flex items-center">
              <Icons.bedroom />
              <p className="text-muted-foreground ml-2">{property.roomCount}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
            <h3 className="font-bold">Bathrooms</h3>
            <div className="flex items-center">
              <Icons.bathroom />
              <p className="text-muted-foreground ml-2">{property.bathroomCount}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
            <h3 className="font-bold">Kitchen</h3>
            <div className="flex items-center">
              <Icons.kitchen />
              <p className="text-muted-foreground ml-2">{property.kitchenCount}</p>
            </div>
          </div>
        </div>

        {property.floorCount && property.floorCount > 0 && (
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
              <h3 className="font-bold">Floor</h3>
              <div className="flex items-center">
                <Icons.stairs />
                <p className="text-muted-foreground ml-2">{property.floorCount}</p>
              </div>
            </div>
          </div>
        )}
        {property.furnished && (
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
              <h3 className="font-bold">Furnished</h3>
              <div className="flex items-center">
                <Icons.armChair />
                <p className="text-muted-foreground ml-2">{property.furnished && "Yes"}</p>
              </div>
            </div>
          </div>
        )}
        {property.carParking && (
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
              <h3 className="font-bold">Car Parking</h3>
              <div className="flex items-center">
                <Icons.car />
                <p className="text-muted-foreground ml-2">{property.carParking}</p>
              </div>
            </div>
          </div>
        )}
        {property.bikeParking && (
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
              <h3 className="font-bold">Bike Parking</h3>
              <div className="flex items-center">
                <Icons.motorbike />
                <p className="text-muted-foreground ml-2">{property.bikeParking}</p>
              </div>
            </div>
          </div>
        )}
        {property.houseFacing && (
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
              <h3 className="font-bold">House Facing</h3>
              <div className="flex items-center">
                {property.houseFacing === "North West" || property.houseFacing === "South East" ? (
                  <Icons.compassNWSE />
                ) : property.houseFacing === "North" || property.houseFacing === "South" ? (
                  <Icons.compassNorthSouth />
                ) : property.houseFacing === "East" || property.houseFacing === "West" ? (
                  <Icons.compassEW />
                ) : (
                  <Icons.compassNESW />
                )}
                <p className="text-muted-foreground ml-2">{property.houseFacing}</p>
              </div>
            </div>
          </div>
        )}

        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
            <h3 className="font-bold">EV Charging</h3>
            <div className="flex items-center">
              <Icons.charging />
              <p className="text-muted-foreground ml-2">
                {property.evCharging ? "Yes" : "Unavailable"}
              </p>
            </div>
          </div>
        </div>
        {property.houseArea && (
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
              <h3 className="font-bold">Area</h3>
              <div className="flex items-center">
                <Icons.land className="size-5" />
                <p className="text-muted-foreground ml-2">{property.houseArea}</p>
              </div>
            </div>
          </div>
        )}
        {property.builtAt && (
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
              <h3 className="font-bold">Built At</h3>
              <div className="flex items-center">
                <Icons.calendar className="size-5" />
                <p className="text-muted-foreground ml-2">{formatBuiltDate(property.builtAt)}</p>
              </div>
            </div>
          </div>
        )}
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
            <h3 className="font-bold">Connected To Road</h3>
            <div className="flex items-center">
              <Icons.road />
              <p className="text-muted-foreground ml-2">
                {property.houseConnectedToRoad ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
        {!property.houseConnectedToRoad && (
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
              <h3 className="font-bold">Distance to road</h3>
              <div className="flex items-center">
                <Icons.ruler />
                <p className="text-muted-foreground ml-2">{property.houseDistanceToRoad} meters</p>
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
      <Separator className="my-1.5" />
      <div className="mb-4">
        <div className="mb-2">
          <h2 className="font-bold text-xl mb-4">Facilities</h2>
          <p>{property.facilities}</p>
          {/* <ul>{property.facilities?.map((facility, index) => <li key={index}>{facility}</li>)}</ul> */}
        </div>
      </div>
    </div>
  );
}
