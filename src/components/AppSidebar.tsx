import {
  Baby, LayoutDashboard, Stethoscope, TrendingUp,
  Syringe, Pill, FileText, Receipt, Users
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useApp } from '@/lib/contexts/AppContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { APP_TITLE, APP_TAGLINE } from '@/lib/appMeta';

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Children', url: '/children', icon: Users },
  { title: 'Hospital Visits', url: '/visits', icon: Stethoscope },
  { title: 'Growth Charts', url: '/growth', icon: TrendingUp },
  { title: 'Vaccinations', url: '/vaccinations', icon: Syringe },
  { title: 'Prescriptions', url: '/prescriptions', icon: Pill },
  { title: 'Documents', url: '/documents', icon: FileText },
  { title: 'Billing', url: '/billing', icon: Receipt },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { children, selectedChildId, setSelectedChildId } = useApp();


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2" title={collapsed ? `${APP_TITLE} — ${APP_TAGLINE}` : undefined}>
          <Baby className="h-6 w-6 text-primary shrink-0" aria-hidden />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <span className="font-display font-bold text-lg text-primary block leading-tight">{APP_TITLE}</span>
              <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5 line-clamp-2">{APP_TAGLINE}</span>
            </div>
          )}
        </div>
        {!collapsed && children.length > 0 && (
          <Select value={selectedChildId || ''} onValueChange={setSelectedChildId}>
            <SelectTrigger className="mt-3">
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              {children.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/'} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                      <item.icon className="h-4 w-4 mr-2 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}
