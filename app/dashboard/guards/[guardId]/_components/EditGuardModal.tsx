import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { type Guard } from '@/constants/mock-api';

interface EditGuardModalProps {
  guard: Guard;
  onSave: (updatedGuard: Guard) => void;
}

const EditGuardModal = ({ guard, onSave }: EditGuardModalProps) => {
  const [formData, setFormData] = useState(guard);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Guard Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="addressLine1">Address</Label>
            <Input
              id="addressLine1"
              value={formData.addressLine1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  addressLine1: e.target.value
                }))
              }
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGuardModal;
