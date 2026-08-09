"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, ScanLine, Leaf, Cloud, BarChart2, Map, Satellite, MessageSquare, DollarSign, TrendingUp, Sun, Moon, LogOut, MessageCircle, Phone, LucideIcon, Landmark, Newspaper, Navigation, Zap,
  Globe, Brain, Sprout, Droplets, FlaskConical, ShieldAlert, CloudRain, Waves, CalendarDays, Settings2, History, LineChart, Box, Server, WifiOff
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";

const navItems = [
  { label: "Home", icon: Home, href: "/overview" },
  { label: "Farm Setup", icon: Leaf, href: "/setup" },
  { label: "Farmers Hub", icon: Landmark, href: "/farmers-hub" },
  { label: "Farm Assistant", icon: MessageSquare, href: "/assistant" },
  { label: "Scan & Crop Recommendation", icon: ScanLine, href: "/scan" },
  { label: "Satellite", icon: Satellite, href: "/satellite" },
  { label: "Crop Prices", icon: TrendingUp, href: "/crop-price" },
  { label: "Community", icon: MessageCircle, href: "/community" },
  { label: "Helpline", icon: Phone, href: "/helpline" },
  { label: "Finance", icon: DollarSign, href: "/finance" },
  { label: "AI Precision Engine", icon: Zap, href: "/precision" },
];

const section2Items = [
  { label: "Soil", icon: Leaf, href: "/soil" },
  { label: "Weather", icon: Cloud, href: "/weather" },
  { label: "Map", icon: Map, href: "/farm-map" },
  { label: "Carbon Credits", icon: Navigation, href: "/carbon" },
];

/* ─── New Advanced Modules ─── */
const intelligenceItems = [
  { label: "GIS Dashboard", icon: Globe, href: "/gis-dashboard" },
  { label: "Explainable AI", icon: Brain, href: "/xai-engine" },
  { label: "Digital Twin", icon: Box, href: "/digital-twin" },
];

const forecastItems = [
  { label: "Yield Forecast", icon: Sprout, href: "/yield-forecast" },
  { label: "Water Intelligence", icon: Droplets, href: "/water-intelligence" },
  { label: "Fertilizer Engine", icon: FlaskConical, href: "/fertilizer-engine" },
  { label: "Price Forecast", icon: LineChart, href: "/price-forecast" },
];

const riskItems = [
  { label: "Climate Risk", icon: ShieldAlert, href: "/climate-risk" },
  { label: "Drought Monitor", icon: CloudRain, href: "/drought-monitor" },
  { label: "Flood Prediction", icon: Waves, href: "/flood-prediction" },
];

const analyticsItems = [
  { label: "Crop Timeline", icon: CalendarDays, href: "/crop-timeline" },
  { label: "Resource Optimize", icon: Settings2, href: "/resource-optimization" },
  { label: "Historical Data", icon: History, href: "/historical-analytics" },
];

const section4Items = [
  { label: "Offline Mode", icon: WifiOff, href: "/offline-mode" },
  { label: "Feedback", icon: MessageCircle, href: "/feedback" },
  { label: "System Status", icon: Server, href: "/system-status" },
];

function NavLink({ item, pathname }: { item: { label: string; icon: LucideIcon; href: string }; pathname: string }) {
  const Icon = item.icon;
  const isActive = pathname === item.href;
  return (
    <Link
      href={item.href}
      className={`sidebar-nav-item ${isActive ? "active" : ""}`}
    >
      <Icon size={15} />
      <span>{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ fontSize: 18 }}>🌱</span>
          <div>
            <div className="sidebar-brand-title">Agri Nova</div>
            <div className="sidebar-brand-subtitle">Your Agriculture Ai Platform</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
        
        <div className="sidebar-divider" />
        
        {section2Items.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
        
        <div className="sidebar-divider" />
        <div style={{ padding: '4px 16px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', opacity: 0.6 }}>Intelligence</div>
        {intelligenceItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        <div style={{ padding: '4px 16px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', opacity: 0.6 }}>Forecasting</div>
        {forecastItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        <div style={{ padding: '4px 16px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', opacity: 0.6 }}>Risk & Climate</div>
        {riskItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        <div style={{ padding: '4px 16px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', opacity: 0.6 }}>Analytics</div>
        {analyticsItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        <div className="sidebar-divider" />
        
        {section4Items.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="sidebar-footer-btn" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </button>
        <button onClick={handleLogout} className="sidebar-footer-btn logout-btn" title="Logout">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
