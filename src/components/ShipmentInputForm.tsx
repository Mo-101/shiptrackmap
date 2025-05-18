import React from 'react';

export interface ShipmentInputFormValues {
  request_reference?: string;
  cargo_description: string;
  item_category: string;
  origin_country: string;
  origin_longitude: number;
  origin_latitude: number;
  destination_country: string;
  destination_longitude: number;
  destination_latitude: number;
  carrier: string;
  weight_kg: number;
  volume_cbm: number;
  value?: number;
  urgency?: string;
  perishable?: boolean;
}

interface ShipmentInputFormProps {
  values: ShipmentInputFormValues;
  onChange: (values: ShipmentInputFormValues) => void;
  disabledFields?: string[];
}

const categories = [
  'Emergency Health Kits',
  'Medical Supplies',
  'Food',
  'Water',
  'Shelter',
  'PPE',
  'Other',
];

const ShipmentInputForm: React.FC<ShipmentInputFormProps> = ({ values, onChange, disabledFields = [] }) => {
  // Helper to update a single field
  const setField = (field: keyof ShipmentInputFormValues, value: any) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-palette-mint mb-1">Cargo Description</label>
          <input
            type="text"
            className="w-full rounded p-2 bg-palette-darkblue/50 border border-palette-mint/30 text-white"
            value={values.cargo_description}
            onChange={e => setField('cargo_description', e.target.value)}
            disabled={disabledFields.includes('cargo_description')}
          />
        </div>
        <div>
          <label className="block text-palette-mint mb-1">Category</label>
          <select
            className="w-full rounded p-2 bg-palette-darkblue/50 border border-palette-mint/30 text-white"
            value={values.item_category}
            onChange={e => setField('item_category', e.target.value)}
            disabled={disabledFields.includes('item_category')}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-palette-mint mb-1">Origin Country</label>
          <input
            type="text"
            className="w-full rounded p-2 bg-palette-darkblue/50 border border-palette-mint/30 text-white"
            value={values.origin_country}
            onChange={e => setField('origin_country', e.target.value)}
            disabled={disabledFields.includes('origin_country')}
          />
        </div>
        <div>
          <label className="block text-palette-mint mb-1">Destination Country</label>
          <input
            type="text"
            className="w-full rounded p-2 bg-palette-darkblue/50 border border-palette-mint/30 text-white"
            value={values.destination_country}
            onChange={e => setField('destination_country', e.target.value)}
            disabled={disabledFields.includes('destination_country')}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-palette-mint mb-1">Weight (kg)</label>
          <input
            type="number"
            className="w-full rounded p-2 bg-palette-darkblue/50 border border-palette-mint/30 text-white"
            value={values.weight_kg}
            onChange={e => setField('weight_kg', Number(e.target.value))}
            disabled={disabledFields.includes('weight_kg')}
          />
        </div>
        <div>
          <label className="block text-palette-mint mb-1">Volume (cbm)</label>
          <input
            type="number"
            className="w-full rounded p-2 bg-palette-darkblue/50 border border-palette-mint/30 text-white"
            value={values.volume_cbm}
            onChange={e => setField('volume_cbm', Number(e.target.value))}
            disabled={disabledFields.includes('volume_cbm')}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-palette-mint mb-1">Carrier</label>
          <input
            type="text"
            className="w-full rounded p-2 bg-palette-darkblue/50 border border-palette-mint/30 text-white"
            value={values.carrier}
            onChange={e => setField('carrier', e.target.value)}
            disabled={disabledFields.includes('carrier')}
          />
        </div>
        <div>
          <label className="block text-palette-mint mb-1">Value (USD)</label>
          <input
            type="number"
            className="w-full rounded p-2 bg-palette-darkblue/50 border border-palette-mint/30 text-white"
            value={values.value || ''}
            onChange={e => setField('value', Number(e.target.value))}
            disabled={disabledFields.includes('value')}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-palette-mint mb-1">Urgency</label>
          <select
            className="w-full rounded p-2 bg-palette-darkblue/50 border border-palette-mint/30 text-white"
            value={values.urgency || ''}
            onChange={e => setField('urgency', e.target.value)}
            disabled={disabledFields.includes('urgency')}
          >
            <option value="">Select urgency</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            checked={!!values.perishable}
            onChange={e => setField('perishable', e.target.checked)}
            disabled={disabledFields.includes('perishable')}
            className="mr-2 accent-palette-mint"
          />
          <label className="text-palette-mint">Perishable</label>
        </div>
      </div>
    </div>
  );
};

export default ShipmentInputForm;
