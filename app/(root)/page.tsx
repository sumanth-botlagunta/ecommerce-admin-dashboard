import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <h1 className="text-xl font-bold text-center">
        {' '}
        Welcome there !!!
        <Button className="m-4" variant={'destructive'}>
          Hello
        </Button>
      </h1>
    </div>
  );
}
