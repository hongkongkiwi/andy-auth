import { UserNav } from '@/components/ui/user-nav';

export const Sidebar = () => {
  return (
    <div className="flex h-full flex-col">
      {/* Existing sidebar content */}
      <div className="flex-1">{/* Your existing navigation items */}</div>

      {/* Add this at the bottom */}
      <div className="mt-auto border-t p-4">
        <UserNav />
      </div>
    </div>
  );
};
