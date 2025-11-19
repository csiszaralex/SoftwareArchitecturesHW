import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* FEJLÉC */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="font-semibold text-lg">Parkoló Térkép</h1>

          {/* JOBB OLDALRA TOLÁS (ml-auto) */}
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>

        {/* TARTALOM (Flex-1 kell, hogy kitöltse a maradékot) */}
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
