'use client';
import CustomSidebar from '@/components/layout/sidebar/sidebar';
import SectionBody from '@/components/rest/SectionBody';
import SectionCode from '@/components/rest/SectionCode';
import SectionHeaders from '@/components/rest/SectionHeaders';
import SectionRequestField from '@/components/rest/SectionRequestField';
import SectionResponse from '@/components/rest/SectionResponse';

export default function RestfulPage() {
  return (
    <CustomSidebar className="min-h-150">
      <main className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-[17px]">
          <div className="flex flex-col gap-6 py-4">
            <section className="px-6">
              <SectionRequestField />
            </section>
            <section className="flex flex-col gap-4 px-6 py-5 border-t border-t-black">
              <SectionHeaders />
            </section>
            <section className="px-6">
              <SectionCode />
            </section>
            <section className="px-6">
              <SectionBody />
            </section>
            <section className="px-6">
              <SectionResponse />
            </section>
          </div>
        </div>
      </main>
    </CustomSidebar>
  );
}
