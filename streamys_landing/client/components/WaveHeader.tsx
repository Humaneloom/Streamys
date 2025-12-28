import { cn } from "@/lib/utils";

interface WaveHeaderProps {
  className?: string;
}

export default function WaveHeader({ className }: WaveHeaderProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >

      </svg>
    </div>
  );
}
