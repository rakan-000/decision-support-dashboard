import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Home,
  UploadCloud,
  FlaskConical,
  Landmark,
  Lightbulb,
  Compass,
  Building2,
  Library,
  History,
  Settings,
} from "lucide-react";

export type NavItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
};

export type NavSection = {
  titleKey: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    titleKey: "nav.section.intelligence",
    items: [
      { href: "/", labelKey: "nav.home", icon: Home },
      { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
      { href: "/upload", labelKey: "nav.upload", icon: UploadCloud },
      { href: "/analysis", labelKey: "nav.analysis", icon: FlaskConical },
    ],
  },
  {
    titleKey: "nav.section.governance",
    items: [
      { href: "/governance", labelKey: "nav.governance", icon: Landmark },
      { href: "/recommendations", labelKey: "nav.recommendations", icon: Lightbulb },
      { href: "/decisions", labelKey: "nav.decisions", icon: Compass },
      { href: "/departments", labelKey: "nav.departments", icon: Building2 },
    ],
  },
  {
    titleKey: "nav.section.system",
    items: [
      { href: "/knowledge-base", labelKey: "nav.knowledge", icon: Library },
      { href: "/history", labelKey: "nav.history", icon: History },
      { href: "/settings", labelKey: "nav.settings", icon: Settings },
    ],
  },
];
