import { IoArrowBack } from "react-icons/io5";

export default function EditBulletinHeader({ onBackToDetails }) {
    return (
        <button
            type="button"
            onClick={onBackToDetails}
            className="inline-flex items-center gap-2 text-violet-700 hover:text-violet-900 mb-6 font-medium transition-colors"
        >
            <IoArrowBack />
            Back to Details
        </button>
    );
}
