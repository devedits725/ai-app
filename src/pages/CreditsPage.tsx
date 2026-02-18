import PageHeader from "@/components/layout/PageHeader";
import { ExternalLink, Heart } from "lucide-react";

const credits = [
  { category: "Framework & Library", items: ["React", "TypeScript", "Vite", "TanStack Query", "React Router"] },
  { category: "UI & Styling", items: ["Tailwind CSS", "shadcn/ui", "Lucide Icons", "Framer Motion (via shadcn)"] },
  { category: "Backend & AI", items: ["Supabase", "Google Gemini API", "Deno (Edge Functions)"] },
  { category: "Mobile Support", items: ["Capacitor", "Expo (Native Branch)"] },
];

const CreditsPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="Credits" />
      <div className="flex-1 p-4 space-y-6">
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight">Built with Love</h2>
          <p className="text-sm text-muted-foreground">This toolkit is powered by amazing open-source technologies and community-driven tools.</p>
        </div>

        <div className="space-y-4">
          {credits.map((group) => (
            <div key={group.category} className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">{group.category}</h3>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map((item) => (
                  <div key={item} className="p-3 rounded-xl bg-card border border-border flex items-center justify-between group">
                    <span className="text-xs font-medium">{item}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-secondary/50 border border-border mt-4">
          <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
            Special thanks to the developers and contributors of the libraries used in this project.
            All trademarks and logos are the property of their respective owners.
          </p>
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground pb-8">
        AI Student Pocket Toolkit · v1.0.0
      </p>
    </div>
  );
};

export default CreditsPage;
