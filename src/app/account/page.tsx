import { ProfileForm } from '@/components/account/ProfileForm';

export default function AccountProfilePage() {
  return (
    <ProfileForm
      title="Profile"
      showEmail
      fields={[
        { key: 'firstName', label: 'First name', autoComplete: 'given-name' },
        { key: 'lastName', label: 'Last name', autoComplete: 'family-name' },
        { key: 'phone', label: 'Phone', autoComplete: 'tel' },
      ]}
    />
  );
}
