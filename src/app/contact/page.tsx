import type { Metadata } from 'next';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { PageHero } from '@/components/shop/PageHero';
import { Container } from '@/components/ui/primitives';

export const metadata: Metadata = { title: 'Contact', description: 'Questions about an order or a card? Get in touch with Atlas.', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact" description="Questions about an order, a card or a collection? Send word and we will reply within one business day." scene="plain" crumbs={[{ name: 'Home', href: '/' }, { name: 'Contact' }]} />
      <Container className="max-w-2xl py-10 sm:py-14">
        <InquiryForm type="contact" />
      </Container>
    </>
  );
}
