'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { getAuthErrorMessage } from '@/lib/firebase-error-handler';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChromeIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

export default function LoginPage() {
  const { auth, firestore } = useFirebase();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      if (!auth || !firestore) return;
      try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        const userRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists() && docSnap.data()?.settings?.theme) {
          localStorage.setItem('theme', docSnap.data().settings.theme);
          await setDoc(
            userRef,
            {
              name: user.displayName,
              email: user.email,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } else {
          localStorage.setItem('theme', 'system');
          await setDoc(
            userRef,
            {
              name: user.displayName,
              email: user.email,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              settings: {
                theme: 'system',
              },
            },
            { merge: true }
          );
        }

        router.push('/dashboard');
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: getAuthErrorMessage(error),
        });
      }
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      if (!auth || !firestore) return;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        const userRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data()?.settings?.theme) {
          localStorage.setItem('theme', docSnap.data().settings.theme);
        } else {
          localStorage.setItem('theme', 'system');
        }

        router.push('/dashboard');
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: getAuthErrorMessage(error),
        });
      }
    });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ChromeIcon className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
