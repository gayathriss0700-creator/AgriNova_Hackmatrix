"use client";
import { useState } from 'react';
import { Target, Loader2 } from 'lucide-react';

interface Step1Props {
  data: { location: string; landArea: string; lat?: number; lng?: number };
  updateData: (data: Partial<{ location: string; landArea: string; lat?: number; lng?: number }>) => void;
  onNext: () => void;
}

export default function Step1({ data, updateData, onNext }: Step1Props) {
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [error, setError] = useState('');

  const getLocation = () => {
    setLoadingLoc(true);
    // Hardcoded to always show Chithilappilly, Kerala as requested
    setTimeout(() => {
      updateData({ location: "Chithilappilly, Kerala", lat: 10.5694, lng: 76.1764 });
      setLoadingLoc(false);
    }, 600);
  };

  const handleNext = () => {
    if (!data.location.trim() || !data.landArea.trim()) {
      setError("Please fill all fields");
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="page-title">Step 1: Location</div>
      <p className="page-subtitle">Where is your farm located?</p>

      <div className="field">
        <label className="field-label">Farm Location</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter city or village"
            className="field-input flex-1"
            value={data.location}
            onChange={(e) => updateData({ location: e.target.value })}
          />
          <button onClick={getLocation} className="btn-secondary" disabled={loadingLoc}>
            {loadingLoc ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
          </button>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Land Area (acres)</label>
        <input 
          type="number" 
          placeholder="e.g., 10"
          className="field-input"
          value={data.landArea}
          onChange={(e) => updateData({ landArea: e.target.value })}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end">
        <button onClick={handleNext} className="btn-primary">Next</button>
      </div>
    </div>
  );
}
