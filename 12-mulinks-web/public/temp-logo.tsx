import { Badge } from "@/components/ui/badge";

export default function TempLogo() {
  return (
    <div className="flex items-center gap-4 text-4xl font-extrabold font-mono">
      <div>MULINKS</div>
      <Badge className="text-xs font-extralight h-4 lg:h-5 bg-gray-200 text-black">
        Beta
      </Badge>
    </div>
  );
}
