export default function DeleteBulletinError({ error }) {
    if (!error) {
        return null;
    }

    return (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
        </p>
    );
}