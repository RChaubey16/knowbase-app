"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { clientFetch } from '@/lib/fetch/client';
import { useRouter } from 'next/navigation';
import { OrganisationFields } from '@/types/organisation';

export default function CreateOrganisationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData({ name, slug });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    
    setFormData({ ...formData, slug });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setError(null);

    try {
      const response: OrganisationFields = await clientFetch("/organisations", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
        }),
      });

      console.log("RES", response);

      setSubmitSuccess(true);
      router.push(`/organisation/${response.slug}`);
    } catch (err: unknown) {
      console.error("ERROR:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while creating the organisation.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.slug.trim();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Organisation</h1>
          <p className="text-muted-foreground">
            Set up a new organisation for your team
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Organisation Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Ruturaj Personal 2"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Choose a descriptive name for your organisation
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Organisation Slug</Label>
            <Input
              id="slug"
              type="text"
              placeholder="e.g., ruturaj-personal-2"
              value={formData.slug}
              onChange={handleSlugChange}
              required
              className="w-full font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              URL-friendly identifier (lowercase, hyphens only)
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {submitSuccess && (
            <Alert>
              <AlertDescription>
                Organisation created successfully!
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Organisation'}
          </Button>
        </div>

        {formData.name && (
          <div className="mt-6 p-4 bg-muted rounded-lg border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Preview JSON:</p>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
