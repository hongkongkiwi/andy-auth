import { AuthStatus } from '@/app/auth/_components';

const Nav = () => {
  return (
    <nav>
      {/* Other nav items */}
      <AuthStatus showVerification />
    </nav>
  );
};
