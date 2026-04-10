import BulletinFormShell from "./BulletinFormShell";
import BulletinFormFields from "./BulletinFormFields";
import BulletinFormActions from "./BulletinFormActions";

export default function BulletinForm({
    formTitle,
    formDescription,
    formData,
    error,
    submitting,
    onInputChange,
    onSubmit,
    onCancel,
    submitLabel,
    submittingLabel,
    showDate = false,
    cancelLabel = "Cancel",
    currentUser = null,
}) {
    return (
        <BulletinFormShell
            title={formTitle}
            description={formDescription}
            error={error}
        >
            <form onSubmit={onSubmit} className="space-y-6">
                <BulletinFormFields
                    formData={formData}
                    onInputChange={onInputChange}
                    showDate={showDate}
                    currentUser={currentUser}
                />

                <BulletinFormActions
                    submitLabel={submitLabel}
                    submittingLabel={submittingLabel}
                    submitting={submitting}
                    onCancel={onCancel}
                    cancelLabel={cancelLabel}
                />
            </form>
        </BulletinFormShell>
    );
}
