import AnnouncementsRoom from "../components/general/AnnouncementsRoom";

export default function AnnouncementsPage() {
  return (
    <div className="px-6 py-10">
      <section className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold mb-2">Announcements Room</h1>
        <p className="text-gray-600">
          View live announcements sent by administrators.
        </p>
      </section>

      <AnnouncementsRoom />
    </div>
  );
}