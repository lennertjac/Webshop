import { ProfileForm } from '@/components/account/ProfileForm';

export default function AccountAddressesPage() {
  return (
    <ProfileForm
      title="Shipping address"
      fields={[
        { key: 'address', label: 'Address', autoComplete: 'street-address' },
        { key: 'postalCode', label: 'Postal code', autoComplete: 'postal-code' },
        { key: 'city', label: 'City', autoComplete: 'address-level2' },
        { key: 'country', label: 'Country', autoComplete: 'country-name' },
      ]}
    />
  );
}
