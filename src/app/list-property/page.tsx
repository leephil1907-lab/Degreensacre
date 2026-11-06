import { redirect } from 'next/navigation';

export default function ListPropertyPage() {
  // Use the single authenticated, validated submission flow. The former
  // eight-step wizard only displayed a success alert without saving anything.
  redirect('/submit-property');
}
