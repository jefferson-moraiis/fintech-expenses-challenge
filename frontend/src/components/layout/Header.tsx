import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>

      <h1 className="text-sm font-semibold">{title}</h1>

      <div className="ml-auto hidden sm:block">
        <UserMenu />
      </div>
    </header>
  );
}