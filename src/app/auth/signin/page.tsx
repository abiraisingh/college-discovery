'use client';

import { type FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiFetcher } from '@/api/client';
import { useToast } from '@/hooks/useToast';

export default function AuthPage() {
  const [step, setStep] = useState<'signIn' | 'signUp'>('signIn');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    if (step === 'signUp') {
      try {
        await apiFetcher('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
        });
        toast.notify('Account created. You can sign in now.');
        setStep('signIn');
      } catch (error) {
        toast.notify((error as Error).message);
      } finally {
        setLoading(false);
      }
      return;
    }

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false
    });

    if (result?.error) {
      toast.notify(result.error);
    } else {
      toast.notify('Signed in successfully.');
      window.location.href = '/dashboard';
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-3xl items-center px-4 py-16 sm:px-6">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">{step === 'signIn' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {step === 'signIn' ? 'Use your credentials or Google to continue.' : 'Set up your account for saved colleges and comparisons.'}
            </p>
          </div>
          <Button variant="outline" onClick={() => setStep(step === 'signIn' ? 'signUp' : 'signIn')}>
            {step === 'signIn' ? 'Sign up' : 'Sign in'}
          </Button>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {step === 'signUp' ? (
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          ) : null}
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <Button type="submit" disabled={loading}>
            {step === 'signIn' ? 'Sign in' : 'Create account'}
          </Button>
        </form>
        <div className="mt-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-sm text-slate-500 dark:text-slate-400">or</span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={() => signIn('google')}>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
