import React, { useState } from 'react';

export interface ForwarderQuote {
  name: string;
  quote: number | '';
}

export interface EngineInput {
  requestReference: string;
  description: string;
  category: string;
  origin: string;
  destination: string;
  weight_kg: number | '';
  volume_cbm: number | '';
  carrier: string;
  value_usd: number | '';
  urgency: 'Normal' | 'High';
  perishable: boolean;
  forwarders: ForwarderQuote[];
}

interface Props {
  onSubmit: (input: EngineInput) => void;
}

export const EngineInputPanel: React.FC<Props> = ({ onSubmit }) => {
  const [input, setInput] = useState<EngineInput>({
    requestReference: '',
    description: '',
    category: '',
    origin: '',
    destination: '',
    weight_kg: '',
    volume_cbm: '',
    carrier: '',
    value_usd: '',
    urgency: 'Normal',
    perishable: false,
    forwarders: [
      { name: 'Kuehne & Nagel', quote: '' },
      { name: 'DHL Express', quote: '' },
      { name: 'Scan Global Logistics', quote: '' }
    ]
  });

  const handleForwarderChange = (idx: number, field: keyof ForwarderQuote, value: string) => {
    setInput(prev => {
      const updated = [...prev.forwarders];
      updated[idx] = { ...updated[idx], [field]: field === 'quote' ? (value === '' ? '' : Number(value)) : value };
      return { ...prev, forwarders: updated };
    });
  };

  const addForwarder = () => {
    setInput(prev => ({ ...prev, forwarders: [...prev.forwarders, { name: '', quote: '' }] }));
  };
  const removeForwarder = (idx: number) => {
    setInput(prev => ({ ...prev, forwarders: prev.forwarders.filter((_, i) => i !== idx) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...input,
      weight_kg: input.weight_kg === '' ? 0 : Number(input.weight_kg),
      volume_cbm: input.volume_cbm === '' ? 0 : Number(input.volume_cbm),
      value_usd: input.value_usd === '' ? 0 : Number(input.value_usd),
      forwarders: input.forwarders.filter(f => f.name && f.quote !== '')
    });
  };

  return (
    <form className="bg-palette-blue/40 p-6 rounded-xl sticky top-8 flex flex-col gap-6 min-w-[350px] shadow-xl border border-palette-mint/20 backdrop-blur-md animate-fade-in" onSubmit={handleSubmit}>
      <div className="mb-3">
        <h2 className="text-2xl font-bold text-palette-mint tracking-wider drop-shadow-lg">DeepCAL++ Decision Engine</h2>
        <div className="text-white/60 text-sm mt-1 font-orbitron italic">Let’s enter the Deep. Symbolic context is enforced.</div>
      </div>
      <input name="requestReference" value={input.requestReference} onChange={handleChange} className="input input-bordered mb-1 font-mono" required />
      <input name="description" value={input.description} onChange={handleChange} className="input input-bordered mb-1" />
      <input name="category" value={input.category} onChange={handleChange} className="input input-bordered mb-1" />
      <div className="flex gap-2">
        <input name="origin" value={input.origin} onChange={handleChange} className="input input-bordered flex-1" />
        <input name="destination" value={input.destination} onChange={handleChange} className="input input-bordered flex-1" />
      </div>
      <div className="flex gap-2">
        <input name="weight_kg" value={input.weight_kg} onChange={handleChange} className="input input-bordered flex-1" type="number" min="0" />
        <input name="volume_cbm" value={input.volume_cbm} onChange={handleChange} className="input input-bordered flex-1" type="number" min="0" />
      </div>
      <input name="carrier" value={input.carrier} onChange={handleChange} className="input input-bordered mb-1" />
      <input name="value_usd" value={input.value_usd} onChange={handleChange} className="input input-bordered mb-1" type="number" min="0" />
      <div className="flex gap-4 items-center">
        <label className="label cursor-pointer">
          <span className="label-text text-white/80">Urgency</span>
          <select name="urgency" value={input.urgency} onChange={handleChange} className="select select-bordered ml-2">
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </label>
        <label className="label cursor-pointer ml-4">
          <span className="label-text text-white/80">Perishable</span>
          <input name="perishable" type="checkbox" checked={input.perishable} onChange={handleChange} className="checkbox checkbox-accent ml-2" />
        </label>
      </div>
      <div className="mt-2">
        <div className="text-palette-mint font-semibold mb-1 flex items-center gap-2">
          Forwarder Quotes
          <span className="text-xs text-palette-mint/80">(Name & Quote)</span>
        </div>
        {input.forwarders.map((f, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input
              value={f.name}
              onChange={e => handleForwarderChange(idx, 'name', e.target.value)}
              className="input input-bordered flex-1 font-mono"
              required
            />
            <input
              value={f.quote}
              onChange={e => handleForwarderChange(idx, 'quote', e.target.value)}
              className="input input-bordered w-32 font-mono"
              type="number"
              min="0"
              required
            />
            {input.forwarders.length > 1 && (
              <button type="button" className="btn btn-error px-2 py-1 rounded-md ml-1 shadow-md" onClick={() => removeForwarder(idx)} title="Remove Forwarder">✕</button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn-accent mt-1 px-4 py-1 rounded-md font-bold text-sm shadow-md hover:bg-[#10b981] transition-all duration-300" onClick={addForwarder}>
          + Add Forwarder
        </button>
      </div>
      <button type="submit" className="btn btn-accent mt-4 py-3 text-lg font-bold tracking-wider rounded-md shadow-xl hover:bg-[#10b981] transition-all duration-300 animate-fade-in">
        » Enter the Deep (Analyze)
      </button>
    </form>
  );
};
