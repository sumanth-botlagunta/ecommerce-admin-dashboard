import { UserButton, auth } from '@clerk/nextjs';

import { MainNav } from '@/components/main-nav';
import StoreSwitcher from '@/components/store-switcher';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismaDB';
import { ModeToggle } from './ui/mode-toggle';

const Navbar = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect('sign-in');
  }
  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b border-gray-700/10 max-w-screen">
      <div className="flex items-center justify-between px-4 h-16 w-full gap-2">
        <div className="flex gap-2">
          <StoreSwitcher items={stores} />
          <MainNav />
        </div>
        <div className="flex gap-4 items-center">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
