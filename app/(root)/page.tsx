import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="p-4 absolute top-0 right-0">
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  );
}
