import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonDemo() {
  return (
    <div className="flex flex-col gap-4 p-3">
      <Skeleton className="w-full h-7" />
      <div className="space-y-2">
        <Skeleton className="w-full h-72" />
      </div>
    </div>
  );
}
