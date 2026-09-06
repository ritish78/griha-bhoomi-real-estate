import { cn } from "@/lib/utlis";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageSkeleton } from "@/components/ui/image-skeleton";

interface PropertyCardSkeletonProps extends React.ComponentPropsWithoutRef<typeof Card> {}

export function PropertyCardSkeleton({ className, ...props }: PropertyCardSkeletonProps) {
  return (
    <Card className={cn("border shadow-md size-full relative overflow-hidden rounded-md")}>
      <CardHeader className="relative overflow-hidden">
        <ImageSkeleton className="object-cover h-full animate-pulse" />
      </CardHeader>
      <CardContent className="p-4 border-b border-gray-200">
        <CardTitle className="mb-5">
          <Skeleton className="mb-2 h-6 w-1/3 space-y-2 animate-pulse" />
        </CardTitle>
        <CardDescription className="mb-4">
          <Skeleton className="mb-2 h-6 w-3/4 space-y-2 animate-pulse" />
        </CardDescription>
        <CardDescription>
          <Skeleton className="mb-2 h-6 w-1/2 space-y-2 animate-pulse" />
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center p-2">
        <Skeleton className="mb-1 h-6 w-1/4 space-y-2 animate-pulse" />
        <Skeleton className="mb-1 ml-2 h-6 w-1/4 space-y-2 animate-pulse" />
        <Skeleton className="mb-1 ml-2 h-6 w-1/4 space-y-2 animate-pulse" />
      </CardFooter>
    </Card>
  );
}
