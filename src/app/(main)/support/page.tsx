'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useFirebase, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


const supportSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email(),
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

const faqs = [
  {
    question: 'How is the ATS score calculated?',
    answer: 'Our AI analyzes your resume for key factors like keyword matching, skill relevance to job descriptions, proper formatting, and the use of action verbs. It then assigns a score based on how well it aligns with what Applicant Tracking Systems look for.',
  },
  {
    question: 'Can I upload a PDF resume?',
    answer: 'Currently, the app supports pasting resume text directly. We are working on adding PDF and DOCX upload functionality in a future update.',
  },
    {
    question: 'Is my data secure?',
    answer: 'Absolutely. All your data, including your resume and personal information, is stored securely in your own Firestore database and is only accessible by you. We do not share your data with third parties.',
  },
];


export default function SupportPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const { firestore } = useFirebase();
    const { user } = useUser();

    const form = useForm<z.infer<typeof supportSchema>>({
        resolver: zodResolver(supportSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    useEffect(() => {
        if(user) {
            form.setValue('name', user.displayName || '');
            form.setValue('email', user.email || '');
        }
    }, [user, form]);

    function onSubmit(values: z.infer<typeof supportSchema>) {
        if (!firestore || !user) return;

        startTransition(async () => {
            try {
                await addDoc(collection(firestore, 'supportMessages'), {
                    ...values,
                    userId: user.uid,
                    createdAt: serverTimestamp(),
                });
                toast({
                    title: 'Message Sent!',
                    description: "Thanks for reaching out. We'll get back to you soon.",
                });
                form.reset({
                    ...values,
                    subject: '',
                    message: '',
                });
            } catch (error) {
                 toast({
                    title: 'Error Sending Message',
                    description: "Something went wrong. Please try again.",
                    variant: 'destructive'
                });
            }
        });
    }

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Support & Help</h1>
                <p className="text-muted-foreground">Find answers to common questions or get in touch with our team.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                     <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>Can&apos;t find an answer? Send us a message.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl><Input placeholder="Your name" {...field} /></FormControl>
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
                                        <FormControl><Input type="email" placeholder="Your email" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl><Input placeholder="How can we help?" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl><Textarea placeholder="Describe your issue..." className="min-h-[120px]" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isPending}>
                               {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Message
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
