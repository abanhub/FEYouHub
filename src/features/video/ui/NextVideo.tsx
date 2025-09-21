import RelatedGrid from "@/features/video/ui/RelatedGrid";

type Item = { videoId: string; title: string; duration?: number };

type Props = {
  related?: Item[];
  onSelect?: (id: string) => void;
};

export default function NextVideo({ related = [], onSelect }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Up next</h2>
      <RelatedGrid items={related} onSelect={onSelect} />
    </div>
  );
}
