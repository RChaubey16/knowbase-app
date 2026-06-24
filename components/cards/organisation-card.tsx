"use client";

import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OrganisationFields } from "@/types/organisation";

interface OrganisationCardProps {
  organisation: OrganisationFields;
}

const OrganisationCard = ({ organisation }: OrganisationCardProps) => {
  const router = useRouter();

  return (
    <Card
      className={cn(
        "group relative flex flex-col h-full bg-card hover:bg-muted/30 transition-all duration-300 border-border/50 hover:border-primary/30 hover:shadow-lg cursor-pointer overflow-hidden"
      )}
      onClick={() => router.push(`/organisation/${organisation.slug}`)}
    >
      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
              {organisation.name}
            </h3>
          </div>
          {organisation.role && (
            <Badge
              variant="outline"
              className={cn(
                "capitalize text-[11px] font-semibold tracking-wide shrink-0",
                organisation.role === "owner" && "bg-primary/10 text-primary border-primary/20",
                organisation.role === "admin" && "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
                organisation.role === "member" && "bg-muted text-muted-foreground border-border"
              )}
            >
              {organisation.role}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          <span>View workspace</span>
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </CardContent>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/5 rounded-xl pointer-events-none transition-all duration-300" />
    </Card>
  );
};

export default OrganisationCard;
