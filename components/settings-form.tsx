'use client';
import * as z from 'zod';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';
import { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from './modals/alert-modal';
import { ApiAlert } from './ui/alert-api';
import { useOrigin } from '@/hooks/useOrigin';

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'store name must in minimium 3 characters',
    })
    .max(50, {
      message: 'store name should not exceed 50 characters',
    }),
});

type SettingsFormType = z.infer<typeof formSchema>;

interface SettingsFormProps {
  intialData: Store;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ intialData }) => {
  const { toast } = useToast();
  const origin = useOrigin();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SettingsFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: intialData,
  });

  const onSubmit = async (data: SettingsFormType) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast({
        title: 'settings saved successfully!!!',
      });
    } catch (err) {
      console.log('SETTINGS onSubmit()', err);
      toast({
        title: 'unable to save settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast({
        title: 'store deleted successfully!!!',
      });
    } catch (err) {
      console.log('SETTINGS onDelete()', err);
      toast({
        title: 'unable to delete store',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between p-2">
        <Heading
          title="Store settings"
          description="Manage store preferences"
        />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-3">
          <div className="grid grid-cols-3 p-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="store name"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row-reverse gap-x-2 px-4">
            <Button type="submit" disabled={loading} variant="default">
              save
            </Button>
            <Button
              disabled={loading}
              type="button"
              variant="destructive"
              onClick={() => setIsOpen(true)}
            >
              delete store
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
      <div className="flex items-center justify-between p-2">
        <Heading
          title="API settings"
          description="APIs for public and admin access"
        />
      </div>
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};
