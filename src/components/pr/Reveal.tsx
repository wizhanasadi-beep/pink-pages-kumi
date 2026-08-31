import { cn } from "@/lib/utils";

/**
 * Conteneur neutre : le contenu s'affiche directement, sans animation d'entrée.
 * (Conservé pour garder la même structure d'appel dans les pages.)
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  return <Tag className={cn(className)}>{children}</Tag>;
}
