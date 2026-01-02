"use client";

import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
            {organisation.name}
          </h3>
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
