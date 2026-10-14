// Draft copy: replace the names, descriptions, photos and story with the real ones.
// Photos go in /public/team/ and are referenced as '/team/name.jpg'; without a photo, initials are shown.

export interface TeamMember {
  /** Used to pick the mailbox: CONTACT_EMAIL_<ID> (falls back to CONTACT_EMAIL). */
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

export const TEAM: TeamMember[] = [
  {
    id: 'founder',
    name: 'Your name',
    role: 'Co-owner',
    bio: 'Collector and dealer. Checks every card that is listed and answers high-value requests personally.',
  },
  {
    id: 'jani',
    name: 'Jani',
    role: 'Co-owner',
    bio: 'Collector and dealer. Handles sourcing, grading and packing.',
  },
];

/** Who answers 'Request to buy' messages. */
export const CONTACT_PERSON = TEAM[0];

export const STORY = {
  title: 'Built for Collectors',
  paragraphs: [
    'Atlas is a map for collectors who hunt for the extraordinary – legendary cards, graded relics and sealed treasures.',
    'We search far and wide, examine every piece ourselves, and send it onward with care.',
    'This page tells the full story: how we met, how we got into the hobby and why we built Atlas.',
    'We also buy: if you have pristine cards worth €200 or more, we pay up to 100% of market value, without the usual discount.',
  ],
};
