import { Skeleton } from "@/components/ui/skeleton";

export function ImageGridSkeleton() {
  // Generate random heights for masonry effect
  const getRandomHeight = (index: number) => {
    const heights = ['h-48', 'h-64', 'h-56', 'h-72', 'h-60'];
    return heights[index % heights.length];
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 20 }, (_, index) => (
        <div key={`skeleton-${index}`} className="space-y-2">
          <Skeleton className={`w-full ${getRandomHeight(index)} rounded-lg`} />
        </div>
      ))}
    </div>
  );
} 