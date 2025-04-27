"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { BookmarkIcon } from "@/components/icons";

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <div className="w-full border-b border-zinc-800 bg-zinc-950">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6">
            <h1 className="text-xl font-bold text-teal-400">German Flashcards</h1>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              {/* Vocabulary Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "text-zinc-200 hover:bg-zinc-800/50 hover:text-teal-300",
                    pathname === "/" || pathname.startsWith("/categories") || pathname === "/bookmarks"
                      ? "bg-zinc-800 text-teal-400" 
                      : ""
                  )}
                >
                  Vocabulary
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-zinc-900 border border-zinc-800 text-zinc-100">
                  <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2 lg:w-[600px]">
                    {/* All Cards */}
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/"
                          className={cn(
                            "flex flex-col h-full w-full justify-between rounded-md bg-gradient-to-b from-zinc-900 to-zinc-800 p-6 no-underline outline-none focus:shadow-md",
                            pathname === "/" 
                              ? "border-2 border-teal-500/50" 
                              : "border border-zinc-700/50"
                          )}
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-teal-400">All Words</div>
                          <p className="text-sm leading-tight text-zinc-400 mb-4">
                            Browse all vocabulary flashcards across all categories
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    
                    {/* Bookmarks */}
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/bookmarks"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                            "hover:bg-zinc-800 hover:text-teal-400",
                            pathname === "/bookmarks" 
                              ? "bg-zinc-800 text-teal-400 border border-teal-500/30" 
                              : "text-zinc-200"
                          )}
                        >
                          <div className="text-sm font-medium leading-none flex items-center">
                            <BookmarkIcon 
                              width={16} 
                              height={16} 
                              className="mr-1" 
                              stroke={pathname === "/bookmarks" ? "#2DD4BF" : "#E2E8F0"}
                            />
                            Bookmarked Words
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-zinc-400">
                            Your saved vocabulary words
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    
                    {/* Categories Section Label */}
                    <li className="col-span-2 mt-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 pl-3">
                        Categories
                      </div>
                    </li>
                    
                    {/* Category Links */}
                    {["Verbs", "Nouns", "Adjectives", "Adverbs", "Prepositions", "Expressions"].map((category) => (
                      <li key={category}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/categories/${category.toLowerCase()}`}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                              "hover:bg-zinc-800 hover:text-teal-400",
                              pathname === `/categories/${category.toLowerCase()}` 
                                ? "bg-zinc-800 text-teal-400 border border-teal-500/30" 
                                : "text-zinc-200"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{category}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-zinc-400">
                              {`${category.toLowerCase()} flashcards`}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Right side items */}
        <div className="flex items-center space-x-4">
          <button className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm transition-colors">
            Study Mode
          </button>
        </div>
      </div>
    </div>
  );
} 