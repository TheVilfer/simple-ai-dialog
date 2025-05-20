import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  variant?: "default" | "page" | "button" | "card";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSkeleton({
  variant = "default",
  size = "md",
  className,
}: LoadingSkeletonProps) {
  if (variant === "page") {
    return (
      <div className={cn("flex min-h-screen items-center justify-center", className)}>
        <div className="text-center">
          <div className="space-y-4 w-64">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "button") {
    const width = size === "sm" ? "w-16" : size === "lg" ? "w-32" : "w-24";
    return (
      <div className={cn("flex justify-center items-center gap-2", className)}>
        <Skeleton className={`h-4 ${width} rounded-md`} />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("rounded-lg border border-border p-6 bg-card", className)}>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  // Default
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
} 