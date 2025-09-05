import Header from "@/components/Header";
import CategoryPills from "@/components/CategoryPills";
import VideoGrid from "@/components/VideoGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <CategoryPills />
      <div className="pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            🔥 Hot videos internationally
          </h2>
          <p className="text-gray-400 mb-6">The most viewed content today</p>
        </div>
        <VideoGrid />
      </div>
    </div>
  );
};

export default Index;
