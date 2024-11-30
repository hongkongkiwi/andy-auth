'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDown, Star } from 'lucide-react';

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  image: 'https://github.com/shadcn.png',
  role: 'Workspace Owner'
} as const;

export const UserNav = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative w-full flex items-center gap-2 px-2 py-1.5 rounded-lg focus-visible:ring-0"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={mockUser.image}
              alt={mockUser.name}
            />
            <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium leading-none">
              {mockUser.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {mockUser.email}
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 transition-all duration-200 hover:shadow-lg hover:shadow-sky-300/5" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <p className="text-sm font-semibold leading-none tracking-tight">{mockUser.name}</p>
            <p className="mt-1 text-xs leading-none text-muted-foreground/70">{mockUser.email}</p>
            <div className="mt-2 flex items-center gap-1.5 bg-gradient-to-r from-sky-300/90 to-blue-300/90 text-transparent bg-clip-text">
              <Star className="h-3.5 w-3.5 fill-sky-300 text-sky-300 transition-transform group-hover:rotate-12" aria-hidden="true" />
              <p className="text-xs leading-none font-medium text-sky-300">{mockUser.role}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
