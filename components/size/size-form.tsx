'use client';
import * as z from 'zod';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Size } from '@prisma/client';
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

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Name must have at least 3 characters',
    })
    .max(50, {
      message: 'Name should not exceed 50 characters',
    }),
  value: z
    .string()
    .min(1, {
      message: 'Value must have at least 1 character',
    })
    .max(10, {
      message: 'Value should not exceed 10 characters',
    }),
});

type SizeFormType = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size | null;
}

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit size' : 'Add new size';
  const description = initialData ? 'Edit Size' : 'Add new Size';
  const toastMessage = initialData ? 'Size updated.' : 'Size created.';
  const action = initialData ? 'Update' : 'Create';

  const form = useForm<SizeFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  });

  const onSubmit = async (data: SizeFormType) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast({
        title: `Size ${action}d`,
      });
    } catch (err) {
      console.log('Size onSubmit()', err);
      toast({
        title: `Unable to ${action} size`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast({
        title: 'Size deleted',
      });
    } catch (err) {
      console.log('Size onDelete()', err);
      toast({
        title: 'Unable to delete size',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-2">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-3">
          <div className="grid grid-cols-3 p-3 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="w-[200px]">
                      <Input
                        placeholder="Size name"
                        disabled={loading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="w-[180px]">
                      <Input
                        placeholder="Size value"
                        disabled={loading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row-reverse gap-x-2 px-4">
            <Button type="submit" disabled={loading} variant="default">
              {action}
            </Button>
            {initialData && (
              <Button
                disabled={loading}
                type="button"
                variant="destructive"
                onClick={() => onDelete()}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};
