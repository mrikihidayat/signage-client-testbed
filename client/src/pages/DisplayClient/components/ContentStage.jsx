export default function ContentStage({ content, isPlaylistMode }) {
  if (!content) return null;

  if (content.tipe === 'image') {
    return <img src={content.payload_url} alt={content.judul} className="w-full h-full object-cover" />;
  }

  if (content.tipe === 'video') {
    return (
      <video
        src={content.payload_url}
        className="w-full h-full object-cover"
        autoPlay
        loop={!isPlaylistMode}
        muted
        playsInline
      />
    );
  }

  if (content.tipe === 'url') {
    return <iframe src={content.payload_url} title={content.judul} className="w-full h-full border-0" />;
  }

  return null;
}
