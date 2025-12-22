
"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CreateWorkspaceForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Workspace Created:', formData);
    setSubmitSuccess(true);
    setIsSubmitting(false);
    
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 500);
    }
  };

  const isFormValid = formData.name.trim() && formData.slug.trim();

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Create Workspace</h2>
        <p className="text-muted-foreground">
          Set up a new workspace for your documents
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workspace-name">Workspace Name</Label>
          <Input
            id="workspace-name"
            type="text"
            placeholder="e.g., Engineering Team"
            value={formData.name}
            onChange={handleNameChange}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workspace-slug">Workspace Slug</Label>
          <Input
            id="workspace-slug"
            type="text"
            placeholder="e.g., engineering-team"
            value={formData.slug}
            onChange={handleSlugChange}
            required
            className="w-full font-mono text-sm"
          />
          <p className="text-[0.8rem] text-muted-foreground">
            URL-friendly identifier
          </p>
        </div>

        {submitSuccess && (
          <Alert>
            <AlertDescription>
              Workspace created successfully!
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Workspace'}
        </Button>
      </div>
    </div>
  );
}
