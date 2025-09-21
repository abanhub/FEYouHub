import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchPage from "@/pages/Search";

const HomePage = lazy(() => import("@/pages/Home"));
const DemoViewPage = lazy(() => import("@/pages/DemoView"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const ChannelPage = lazy(() => import("@/pages/Channel"));

const LoadingFallback = () => <div>Loading...</div>;

export const AppRouter = (): JSX.Element => (
  <BrowserRouter>
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/v/:id" element={<DemoViewPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/c/:id" element={<ChannelPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
