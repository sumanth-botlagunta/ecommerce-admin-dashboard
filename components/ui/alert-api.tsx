import { Badge, BadgeProps } from './badge';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Copy, Server } from 'lucide-react';
import { Button } from './button';
import { useToast } from './use-toast';

interface ApiAlertProps {
  title: string;
  description: string;
  variant: 'public' | 'admin';
}

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = 'public',
}) => {
  const { toast } = useToast();

  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    toast({
      title: 'Copied to clipboard',
    });
  };

  return (
    <Alert className="mt-4">
      <div className="flex  justify-between">
        <div className="flex gap-4">
          <div className="flex items-center">
            <Server className="w-4 h-4" />
          </div>
          <div className="gap-2">
            <AlertTitle>
              {title}{' '}
              <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
            <AlertDescription>
              <code className="rounded bg-muted p-1 font-mono font-semibold">
                {description}
              </code>
            </AlertDescription>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            variant={'outline'}
            size="icon"
            onClick={() => {
              onCopy(description);
            }}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};
