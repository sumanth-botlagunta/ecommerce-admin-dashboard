'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

export const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Overview',
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards',
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categories',
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'Sizes',
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'Colors',
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Products',
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'Orders',
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <>
      <nav
        className={cn(
          'lg:flex items-center sp lg:space-x-6 hidden lg:visible',
          className
        )}
        {...props}
      >
        <div className=" flex gap-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm transition-colors font-medium hover:text-primary',
                route.active
                  ? 'text-black dark:text-white'
                  : 'text-muted-foreground'
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className={cn('lg:hidden flex mx-2', className)} {...props}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="h-8 w-8 p-0">
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {routes.map((route) => (
              <DropdownMenuItem
                key={route.href}
                onClick={() => router.push(route.href)}
              >
                <div
                  className={cn(
                    'text-sm transition-colors font-medium hover:text-primary',
                    route.active
                      ? 'text-black dark:text-white'
                      : 'text-muted-foreground'
                  )}
                >
                  {route.label}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
