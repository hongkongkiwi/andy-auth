'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone } from 'lucide-react';
import { VerifyPhone } from './verify-phone';
import { cn } from '@/lib/utils';
import {
  useVerification,
  VerificationProvider
} from '../contexts/verification-context';

interface VerificationLayoutProps {
  email?: string;
  phone?: string;
  className?: string;
  defaultTab?: 'email' | 'phone';
  onVerified?: () => void;
  redirectUrl?: string;
  children?: React.ReactNode;
}

const VerificationTabs = ({
  email,
  phone,
  defaultTab = 'email',
  children
}: Omit<
  VerificationLayoutProps,
  'className' | 'onVerified' | 'redirectUrl'
>) => {
  const { method, setMethod } = useVerification();

  React.useEffect(() => {
    if (!method) setMethod(defaultTab);
  }, [defaultTab, method, setMethod]);

  return (
    <Tabs
      value={method || defaultTab}
      onValueChange={(v) => setMethod(v as 'email' | 'phone')}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="email">
          <Mail className="mr-2 h-4 w-4" />
          Email
        </TabsTrigger>
        <TabsTrigger value="phone">
          <Phone className="mr-2 h-4 w-4" />
          Phone
        </TabsTrigger>
      </TabsList>

      <TabsContent value="email">{children}</TabsContent>

      <TabsContent value="phone">
        <VerifyPhone phone={phone} />
      </TabsContent>
    </Tabs>
  );
};

export const VerificationLayout = (props: VerificationLayoutProps) => {
  const { className, onVerified, redirectUrl, ...rest } = props;

  return (
    <VerificationProvider onVerified={onVerified} redirectUrl={redirectUrl}>
      <Card className={cn('mx-auto w-full max-w-md', className)}>
        <CardHeader>
          <CardTitle>Verify Your Identity</CardTitle>
          <CardDescription>
            Choose your preferred verification method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerificationTabs {...rest} />
        </CardContent>
      </Card>
    </VerificationProvider>
  );
};
