import { Suspense } from "react";
import LodgifyProperties from "./LodgifyProperties";
import { ExternalLink } from "lucide-react";

function LoadingState() {
  return (
    <div className="space-y-12">
      {["Leipzig", "Halle"].map((city) => (
        <div key={city}>
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="flex gap-4 pt-2">
                    <div className="h-4 bg-gray-200 rounded w-12" />
                    <div className="h-4 bg-gray-200 rounded w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LodgifyPropertiesLoader() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LodgifyProperties />
    </Suspense>
  );
}
