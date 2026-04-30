"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, LogOut, ShoppingBag, ClipboardList, UserCog, Bell } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCartCount } from "@/redux/features/cart/cartSlice";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { getSocket } from "@/lib/socket-client";
import { notificationService } from "@/services/notification.service";
import NotificationsPanel from "@/components/modules/notifications/NotificationsPanel";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "/logo.png",
    alt: "logo",
    title: "Medistore",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Shop",
      url: "/shop",
    },
    {
      title: "Dashboard",
      url: "/dashboard",
    },
  ],
  auth = {
    login: { title: "Sign In", url: "/signin" },
    signup: { title: "Sign up", url: "/signup" },
  },
  className,
}: Navbar1Props) => {
  const { data: session, isPending } = authClient.useSession();
  const cartCount = useAppSelector(selectCartCount);
  const user = session?.user;
  const role = user?.role?.toUpperCase() || "CUSTOMER";
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();
  const isLoggedIn = !!user;

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);

  const handleLogout = async () => {
    await authClient.signOut();
    setNotificationUnreadCount(0);
  };

  useEffect(() => {
    if (isPending) return;
    if (!isLoggedIn) return;

    let cancelled = false;

    const loadUnread = async () => {
      try {
        const res = await notificationService.listMyNotifications(1);
        if (cancelled) return;
        if (res.ok) setNotificationUnreadCount(res.data.data.unreadCount || 0);
      } catch {
      }
    };

    loadUnread();

    return () => {
      cancelled = true;
    };
  }, [isPending, isLoggedIn]);

  useEffect(() => {
    if (isPending) return;
    if (!isLoggedIn) return;

    const socket = getSocket();

    const handleNew = () => {
      setNotificationUnreadCount((prev) => prev + 1);
      setNotificationRefreshKey((prev) => prev + 1);
    };

    const handleReadAll = () => {
      setNotificationUnreadCount(0);
      setNotificationRefreshKey((prev) => prev + 1);
    };

    socket.on("notification:new", handleNew);
    socket.on("notification:read-all", handleReadAll);

    return () => {
      socket.off("notification:new", handleNew);
      socket.off("notification:read-all", handleReadAll);
    };
  }, [isPending, isLoggedIn]);

  return (
    <section className={cn("sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Desktop Menu */}
        <nav className="hidden h-20 items-center justify-between lg:flex">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-accent/70">
              <Image
                src={logo.src}
                width={150}
                height={48}
                className="h-12 w-auto dark:invert"
                alt={logo.alt}
              />
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                  {isLoggedIn && role === "CUSTOMER" && (
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/orders"
                          className="group inline-flex h-10 w-max items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-foreground/85 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          My Orders
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              {/* <SheetTrigger asChild>
                <button
                  type="button"
                  className="relative group inline-flex items-center justify-center rounded-xl p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
                  aria-label="Open notifications"
                  title="Notifications"
                >
                  <Bell className="size-6 text-foreground/80 group-hover:text-emerald-600 transition-colors" />
                  {notificationUnreadCount > 0 ? (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white shadow-sm animate-in zoom-in duration-300">
                      {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
                    </span>
                  ) : null}
                </button>
              </SheetTrigger> */}
              <SheetContent className="overflow-y-hidden border-l border-border/70 px-5 sm:max-w-md">
                <SheetHeader className="px-0">
                  <SheetTitle className="text-base">Activity</SheetTitle>
                </SheetHeader>
                {/* <div className="h-[calc(100vh-96px)] pb-6">
                  <NotificationsPanel
                    open={notificationsOpen}
                    refreshKey={notificationRefreshKey}
                    onUnreadCountChange={setNotificationUnreadCount}
                    onNavigate={() => setNotificationsOpen(false)}
                  />
                </div> */}
              </SheetContent>
            </Sheet>

            <Link href="/cart" className="relative group p-2 rounded-xl hover:bg-accent transition-colors">
              <ShoppingBag className="size-6 text-foreground/80 group-hover:text-emerald-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>

            {isPending ? (
              <div className="h-10 w-48 animate-pulse rounded-xl border border-border/70 bg-muted/50" />
            ) : isLoggedIn ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/90 px-3 py-2 shadow-sm">
                  <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {userInitial}
                  </div>
                  <div className="max-w-44 leading-tight">
                    <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
                    <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700">
                    {role}
                  </span>
                  <Link
                    href="/profile"
                    className="inline-flex size-8 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                    title="Profile Settings"
                  >
                    <UserCog className="size-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="ml-1 inline-flex size-8 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Button asChild variant="outline" size="sm">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2 rounded-xl px-2 py-1">
              <Image
                src={logo.src}
                width={120}
                height={40}
                className="h-10 w-auto dark:invert"
                alt={logo.alt}
              />
            </Link>

            {/* Right side (Cart + Menu) */}
            <div className="flex items-center gap-2">
              <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                {/* <SheetTrigger asChild>
                  <button
                    type="button"
                    className="relative group inline-flex items-center justify-center rounded-xl p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
                    aria-label="Open notifications"
                    title="Notifications"
                  >
                    <Bell className="size-5 text-foreground/80 group-hover:text-emerald-600 transition-colors" />
                    {notificationUnreadCount > 0 ? (
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
                        {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
                      </span>
                    ) : null}
                  </button>
                </SheetTrigger> */}
                <SheetContent className="overflow-y-hidden border-l border-border/70 px-5 sm:max-w-md">
                  {/* <SheetHeader className="pl-0">
                    <SheetTitle className="text-base">Activity</SheetTitle>
                  </SheetHeader>
                  <div className="h-[calc(100vh-96px)] pb-6">
                    <NotificationsPanel
                      open={notificationsOpen}
                      refreshKey={notificationRefreshKey}
                      onUnreadCountChange={setNotificationUnreadCount}
                      onNavigate={() => setNotificationsOpen(false)}
                    />
                  </div> */}
                </SheetContent>
              </Sheet>

              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative group p-2 rounded-xl hover:bg-accent transition-colors"
              >
                <ShoppingBag className="size-5 text-foreground/80 group-hover:text-emerald-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto border-l border-border/70 px-5">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2 rounded-xl px-1 py-1">
                        <Image
                          src={logo.src}
                          width={120}
                          height={40}
                          className="h-10 w-auto dark:invert"
                          alt={logo.alt}
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-8 pt-6">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-5"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    {isPending ? (
                      <div className="h-12 w-full animate-pulse rounded-xl border border-border/70 bg-muted/50" />
                    ) : isLoggedIn ? (
                      <div className="space-y-4 border-t border-border/70 pt-6">
                        {role === "CUSTOMER" && (
                          <Link
                            href="/orders"
                            className="flex items-center gap-2 rounded-xl border border-border/70 px-4 py-3 text-md font-semibold text-foreground/90 transition hover:bg-accent"
                          >
                            <ClipboardList className="size-5" />
                            My Orders
                          </Link>
                        )}
                        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/90 px-3 py-3 shadow-sm">
                          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                            {userInitial}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
                            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                          </div>
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700">
                            {role}
                          </span>
                          <Link
                            href="/profile"
                            className="inline-flex size-8 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                            title="Profile Settings"
                          >
                            <UserCog className="size-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex size-8 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                            aria-label="Logout"
                            title="Logout"
                          >
                            <LogOut className="size-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 border-t border-border/70 pt-6">
                        <Button asChild variant="outline">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild>
                          <Link href={auth.signup.url}>{auth.signup.title}</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className="group inline-flex h-10 w-max items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-foreground/85 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-4 focus-visible:ring-ring/30"
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="rounded-xl border border-border/70 px-3">
        <AccordionTrigger className="text-md py-3 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 pb-3">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      key={item.title}
      href={item.url}
      className="rounded-xl border border-border/70 px-4 py-3 text-md font-semibold text-foreground/90 transition hover:bg-accent"
    >
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="flex min-w-80 flex-row gap-4 rounded-xl p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { Navbar };
