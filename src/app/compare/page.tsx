import { Suspense } from 'react';
import CompareClient from './CompareClient';

export const dynamic = 'force-dynamic';

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center">Loading compare page...</div>}>
      <CompareClient />
    </Suspense>
  );
}
