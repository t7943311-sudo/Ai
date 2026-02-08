'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useTransition, useState } from 'react';
import { Loader2, Moon, Sun, Laptop } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useFirebase, useUser } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useTheme } from '@/providers/theme-provider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const settingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
  targetRole: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().optional(),
  onboardingCompleted: z.boolean(),
});

type UserSettings = z.infer<typeof settingsSchema>;

const languages = [
    { value: 'en-US', label: 'English (United States)' },
    { value: 'es-ES', label: 'Español (España)' },
    { value: 'fr-FR', label: 'Français (France)' },
    { value: 'de-DE', label: 'Deutsch (Deutschland)' },
];

export default function SettingsPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const { firestore, auth } = useFirebase();
    const { user } = useUser();
    const { setTheme } = useTheme();
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const form = useForm<UserSettings>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: '',
            email: '',
            targetRole: '',
            theme: 'system',
            language: 'en-US',
            onboardingCompleted: true,
        },
    });

    useEffect(() => {
        if (user && firestore) {
            const userRef = doc(firestore, 'users', user.uid);
            getDoc(userRef).then(docSnap => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const settings = data.settings || {};
                    form.reset({
                        name: data.name || user.displayName || '',
                        email: data.email || user.email || '',
                        targetRole: settings.targetRole || '',
                        theme: settings.theme || 'system',
                        language: settings.language || 'en-US',
                        onboardingCompleted: settings.onboardingCompleted !== false,
                    });
                }
            });
        }
    }, [user, firestore, form]);

    async function onSubmit(values: UserSettings) {
        if (!user || !firestore || !auth) return;
        startTransition(async () => {
            try {
                if (user.displayName !== values.name) {
                    await updateProfile(user, { displayName: values.name });
                }

                const userRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userRef);
                const existingSettings = userDoc.data()?.settings || {};

                await setDoc(userRef, {
                    name: values.name,
                    updatedAt: serverTimestamp(),
                    settings: {
                        ...existingSettings,
                        targetRole: values.targetRole,
                        theme: values.theme,
                        language: values.language,
                        onboardingCompleted: values.onboardingCompleted,
                    }
                }, { merge: true });

                toast({
                    title: 'Settings Saved',
                    description: 'Your profile settings have been updated.',
                });
            } catch (error) {
                console.error("Failed to save settings:", error);
                toast({
                    title: 'Error',
                    description: 'Failed to save settings.',
                    variant: 'destructive',
                });
            }
        });
    }

     const handleDeleteAccount = () => {
        toast({
            title: 'Account Deletion (Not Implemented)',
            description: 'This feature is not yet fully functional.',
            variant: 'destructive'
        });
    }

    return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences.</p>
        </div>
        <Separator />

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>This is how your name will be displayed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your email" {...field} disabled />
                                    </FormControl>
                                    <FormDescription>Your login email cannot be changed.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Tailor your experience for better AI results and usability.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                         <FormField
                            control={form.control}
                            name="targetRole"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Role</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Product Manager" {...field} />
                                    </FormControl>
                                    <FormDescription>This helps us tailor AI suggestions for you.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Language</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a language" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {languages.map((lang) => (
                                                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Your preferred language for the interface.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="onboardingCompleted"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Show Onboarding Guide</FormLabel>
                                        <FormDescription>
                                            See the welcome guide on the dashboard again.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={!field.value}
                                            onCheckedChange={(checked) => field.onChange(!checked)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="theme"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Theme</FormLabel>
                                <FormDescription>Select the theme for the dashboard.</FormDescription>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setTheme(value as 'light' | 'dark' | 'system');
                                    }}
                                    value={field.value}
                                    className="grid max-w-md grid-cols-3 gap-8 pt-2"
                                    >
                                    <FormItem>
                                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="light" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                                <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                            </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            Light
                                        </span>
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="dark" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:border-accent">
                                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                <div className="h-4 w-4 rounded-full bg-slate-400" />
                                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                                <div className="h-4 w-4 rounded-full bg-slate-400" />
                                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                            </div>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            Dark
                                        </span>
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="system" className="sr-only" />
                                        </FormControl>
                                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                            <div className="flex h-[116px] items-center justify-center rounded-sm bg-muted">
                                                <Laptop className="h-8 w-8 text-muted-foreground"/>
                                            </div>
                                        </div>
                                        <span className="block w-full p-2 text-center font-normal">
                                            System
                                        </span>
                                        </FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                </Card>

                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </form>
        </Form>

         <Separator />

        <Card className="border-destructive max-w-2xl">
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>This action is permanent and cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete My Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers. To confirm, please type
                                <strong className="font-bold text-foreground mx-1">DELETE</strong> below.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                         <Input
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="DELETE"
                            className="my-2"
                        />
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE'}
                                className={cn(buttonVariants({ variant: "destructive" }))}
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>

    </div>
  );
}
