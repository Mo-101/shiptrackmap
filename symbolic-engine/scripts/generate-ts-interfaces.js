// Script to generate TypeScript interfaces from JSON Schemas
// Usage: node ./symbolic-engine/scripts/generate-ts-interfaces.js

const path = require('path');
const fs = require('fs');
const { compileFromFile } = require('json-schema-to-typescript');

const schemas = [
  {
    input: path.join(__dirname, '../core/base_schema/shipmentsField.json'),
    output: path.join(__dirname, '../core/base_schema/interfaces/ShipmentsInput.ts'),
    typeName: 'ShipmentsInput'
  },
  {
    input: path.join(__dirname, '../core/base_schema/recommendationSchema.json'),
    output: path.join(__dirname, '../core/base_schema/interfaces/RecommendationSchema.ts'),
    typeName: 'SymbolicRecommendation'
  }
];

(async () => {
  for (const schema of schemas) {
    try {
      const ts = await compileFromFile(schema.input, { bannerComment: '', style: { singleQuote: true }, unreachableDefinitions: true, declareExternallyReferenced: true, $refOptions: { resolve: { file: true } } });
      // Replace interface name with desired typeName
      const tsFixed = ts.replace(/interface [^{]+{/, `interface ${schema.typeName} {`);
      fs.writeFileSync(schema.output, tsFixed, 'utf8');
      console.log(`Generated ${schema.output}`);
    } catch (err) {
      console.error(`Failed to generate for ${schema.input}:`, err);
    }
  }
})();
