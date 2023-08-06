'use client';
import React from 'react';
import * as z from 'zod';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { AlertModal } from '@/components/modals/alert-modal';
import { Color } from '@prisma/client';

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'name must be at least 3 characters',
    })
    .max(50, {
      message: 'name should not exceed 50 characters',
    }),
  value: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Invalid color value, use HEX format (#RRGGBB)',
  }),
});

type ColorFormType = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData: Color | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Set the initial color value

  const title = initialData ? 'Edit color' : 'Add new color';
  const description = initialData ? 'Edit Color' : 'Add new Color';
  const toastMessage = initialData ? 'Color updated.' : 'Color created.';
  const action = initialData ? 'Update' : 'Create';

  const form = useForm<ColorFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  });

  const onSubmit = async (data: ColorFormType) => {
    try {
      setLoading(true); // Set the selected color to the form data
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast({
        title: `Color ${action}d`,
      });
    } catch (err) {
      console.log('Color onSubmit()', err);
      toast({
        title: `Unable to ${action} color`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast({
        title: 'Color deleted',
      });
    } catch (err) {
      console.log('Color onDelete()', err);
      toast({
        title: 'Unable to delete color',
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
                        placeholder="Color name"
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
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="w-[250px] flex gap-2 items-center">
                      <Input
                        placeholder="Color Hex"
                        disabled={loading}
                        {...field}
                      />
                      <div
                        className="w-9 h-9 rounded-full border-2 border-black ml-2"
                        style={{ backgroundColor: field.value }}
                      ></div>
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
                onClick={() => setIsOpen(true)}
              >
                delete
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};
