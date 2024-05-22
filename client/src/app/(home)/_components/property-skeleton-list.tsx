import { PropertyCardSkeleton } from "./property-skeleton";

interface PropertyCardSkeletonListProps {
  numberOfSkeletons: number;
}

export default async function PropertyCardSkeletonList({
  numberOfSkeletons
}: PropertyCardSkeletonListProps) {
  return Array.from({ length: numberOfSkeletons }).map((_, index) => (
    <PropertyCardSkeleton key={index} />
  ));
}
