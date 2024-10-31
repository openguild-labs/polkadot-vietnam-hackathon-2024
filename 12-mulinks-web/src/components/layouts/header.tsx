"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { IconCaretUpFilled, IconMenu2 } from "@tabler/icons-react";
import { forwardRef, useEffect, useState } from "react";
import TempLogo from "../../../public/temp-logo";

const resources: { title: string; href: string; description: string }[] = [
  {
    title: "Documentation",
    href: "/docs",
    description:
      "Learn how to get started with our comprehensive documentation.",
  },
  {
    title: "Community",
    href: "/community",
    description:
      "Join our vibrant community to share your ideas and get support from fellow users.",
  },
  {
    title: "Blog",
    href: "/blog",
    description:
      "Read our latest blog posts to stay updated with the latest trends and best practices.",
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <div
      className={`fixed top-0 z-40 w-full flex-none bg-white transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full border-b-2"
      }`}
    >
      <div className="mx-auto px-4 lg:px-8 py-4">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <a href="/" className="text-2xl font-bold">
              <TempLogo />
            </a>
          </div>

          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div>is updating</div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {resources.map((resource) => (
                        <ListItem
                          key={resource.title}
                          title={resource.title}
                          href={resource.href}
                        >
                          {resource.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/roadmap" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Roadmap
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about-us" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex">
              <div className="hidden lg:block">
                <Link href={"/assetlinks"}>
                  <Button
                    size="lg"
                    className="bg-black text-white font-semibold"
                  >
                    Try It Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="block lg:hidden">
              <Button size="icon" variant="ghost" onClick={handleMenuToggle}>
                <IconMenu2 />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden fixed top-0 left-0 right-0 bg-white z-50 flex items-center justify-center text-center w-full  transition-transform duration-300 ease-in-out ${
              isMenuOpen
                ? "translate-y-0 shadow-2xl border-b-2 rounded-lg"
                : "-translate-y-full"
            }`}
          >
            <div className="p-4">
              <a href="/" className="text-2xl font-bold mb-6 block">
                <TempLogo />
              </a>
              <nav className="space-y-4">
                <Link
                  href="/roadmap"
                  onClick={handleMenuToggle}
                  className="block text-lg font-semibold"
                >
                  Roadmap
                </Link>
                <Link
                  href="/about-us"
                  onClick={handleMenuToggle}
                  className="block text-lg font-semibold"
                >
                  About Us
                </Link>
              </nav>
              <div className="block lg:hidden">
                <Button size="icon" variant="ghost" onClick={handleMenuToggle}>
                  <IconCaretUpFilled />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
