export default function SpecialistDrawer({ data, onClose }: any) {

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">

      <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto">

        <div className="flex justify-between mb-4">
          <h3 className="font-bold text-lg">Specialist Details</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* PROFILE */}
        <div className="text-center mb-4">
          <img
            src={data.profilePhoto || "https://via.placeholder.com/100"}
            className="w-24 h-24 rounded-full mx-auto mb-2"
          />
          <h4 className="font-semibold">{data.fullName}</h4>
          <p className="text-sm text-gray-500">{data.email}</p>
        </div>

        {/* BASIC */}
        <div className="space-y-2 text-sm">
          <p><b>Phone:</b> {data.phone}</p>
          <p><b>City:</b> {data.location?.city}</p>
          <p><b>State:</b> {data.location?.state}</p>
        </div>

        {/* ORGANIZATION */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Organization</h4>

          <p><b>Name:</b> {data.organizationDetails?.organizationName}</p>
          <p><b>Type:</b> {data.organizationDetails?.organizationType}</p>
          <p><b>Experience:</b> {data.organizationDetails?.experienceYears} yrs</p>
          <p><b>Mode:</b> {data.organizationDetails?.consultationMode}</p>

          <p>
            <b>Fees:</b> ₹{data.organizationDetails?.pricing?.online} /
            ₹{data.organizationDetails?.pricing?.offline}
          </p>

          <p>
            <b>Specialization:</b>{" "}
            {data.organizationDetails?.specialization?.join(", ")}
          </p>
        </div>

        {/* BIO */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Bio</h4>
          <p className="text-sm text-gray-600">{data.bio}</p>
        </div>

        {/* DOCUMENTS */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Documents</h4>

          <div className="grid grid-cols-2 gap-2">
            {data.documents?.map((doc: any, i: number) => (
              <img
                key={i}
                src={doc.url}
                className="w-full h-24 object-cover rounded border"
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}