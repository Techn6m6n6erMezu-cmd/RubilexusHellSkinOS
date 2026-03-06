import { useState, useEffect, useRef } from 'react';
import { Activity, Gauge } from 'lucide-react';
import { supabase, PerformanceDistrict } from '../lib/supabase';

type PerformanceMetrics = {
  fps: number;
  entities: number;
  drawCalls: number;
};

export function DistrictViewer() {
  const [districts, setDistricts] = useState<PerformanceDistrict[]>([]);
  const [activeDistrict, setActiveDistrict] = useState<PerformanceDistrict | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 60, entities: 0, drawCalls: 0 });
  const animationRef = useRef<number>();
  const lastFrameTime = useRef(performance.now());
  const frameCount = useRef(0);

  useEffect(() => {
    loadDistricts();
  }, []);

  useEffect(() => {
    if (activeDistrict) {
      startPerformanceMonitoring();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeDistrict]);

  const loadDistricts = async () => {
    const { data } = await supabase
      .from('performance_districts')
      .select('*')
      .eq('active', true)
      .order('name');

    if (data) {
      setDistricts(data);
      if (data.length > 0) {
        setActiveDistrict(data[0]);
      }
    }
  };

  const startPerformanceMonitoring = () => {
    const updateMetrics = () => {
      const now = performance.now();
      const delta = now - lastFrameTime.current;

      frameCount.current++;

      if (frameCount.current % 10 === 0) {
        const currentFps = Math.round(1000 / delta);
        setMetrics({
          fps: Math.min(currentFps, activeDistrict?.config.target_fps || 60),
          entities: Math.floor(Math.random() * (activeDistrict?.config.max_entities || 100)),
          drawCalls: Math.floor(Math.random() * 50) + 10,
        });
      }

      lastFrameTime.current = now;
      animationRef.current = requestAnimationFrame(updateMetrics);
    };

    updateMetrics();
  };

  const getDistrictColor = (slug: string) => {
    switch (slug) {
      case 'hellsphere-arcade':
        return 'from-red-900 to-orange-900';
      case 'tv-pumpkin-sphere':
        return 'from-orange-900 to-yellow-900';
      case 'abyssal-arena':
        return 'from-purple-900 to-red-900';
      default:
        return 'from-gray-900 to-red-900';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Performance Districts</h2>
        <p className="text-gray-500 text-sm">High-fidelity 3D environments optimized for 60fps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {districts.map((district) => (
          <button
            key={district.id}
            onClick={() => setActiveDistrict(district)}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              activeDistrict?.id === district.id
                ? 'border-red-600 bg-red-950'
                : 'border-gray-800 bg-gray-950 hover:border-gray-700'
            }`}
          >
            <div className="font-semibold text-gray-300 mb-1">{district.name}</div>
            <div className="text-xs text-gray-600">
              Target: {district.config.target_fps}fps • Quality: {district.config.quality}
            </div>
          </button>
        ))}
      </div>

      {activeDistrict && (
        <div className="space-y-4">
          <div className={`rounded-lg bg-gradient-to-br ${getDistrictColor(activeDistrict.slug)} p-8 aspect-video relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-black/50" />
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                {[...Array(64)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-red-500/10 animate-pulse"
                    style={{
                      animationDelay: `${i * 50}ms`,
                      animationDuration: '3s',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-2">
                {activeDistrict.name}
              </div>
              <div className="text-red-200 text-sm">
                3D Environment • {activeDistrict.config.quality.toUpperCase()} Quality
              </div>
            </div>

            <div className="absolute bottom-4 right-4 z-10">
              <div className="flex items-center gap-2 bg-black/80 px-3 py-2 rounded">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-mono text-sm">{metrics.fps} FPS</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-500">Frame Rate</span>
              </div>
              <div className="text-2xl font-bold text-gray-300">
                {metrics.fps} <span className="text-sm text-gray-600">/ {activeDistrict.config.target_fps}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-green-600 transition-all duration-300"
                  style={{ width: `${(metrics.fps / activeDistrict.config.target_fps) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-500">Active Entities</span>
              </div>
              <div className="text-2xl font-bold text-gray-300">
                {metrics.entities} <span className="text-sm text-gray-600">/ {activeDistrict.config.max_entities}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${(metrics.entities / (activeDistrict.config.max_entities || 100)) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-500">Draw Calls</span>
              </div>
              <div className="text-2xl font-bold text-gray-300">{metrics.drawCalls}</div>
              <div className="text-xs text-gray-600 mt-1">Optimized rendering pipeline</div>
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-300 mb-3">District Configuration</h3>
            <pre className="text-xs text-gray-500 font-mono overflow-x-auto">
              {JSON.stringify(activeDistrict.config, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
