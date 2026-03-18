export default function PdfViewer({ fileUrl }) {
  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <iframe
        src={fileUrl}
        className="w-full h-full border-none"
        style={{ display: "block" }}
      />
    </div>
  );
}