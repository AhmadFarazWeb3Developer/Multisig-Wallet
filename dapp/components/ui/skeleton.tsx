import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-gradient-to-br  from-[#404040] to-[#3d3d3d] animate-pulse rounded-md  border border-[#333333]  rounded-t-md   sm:rounded-tr-none  sm:rounded-l-md sm:rounded-br-md ",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
