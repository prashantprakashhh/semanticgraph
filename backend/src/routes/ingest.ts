// backend/src/routes/ingest.ts
import { Router } from 'express';
import SparqlClient from 'sparql-http-client';
import { extractEntitiesAndRelationships } from '../services/nlp';
import { config } from '../config';

const router = Router();
const SKG = 'http://semantic-knowledge-graph.org/ontology#';

router.post('/', async (req, res) => {
  const client = new SparqlClient({ endpointUrl: config.fusekiUrl });
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }
  try {
    const { entities, relationships } = extractEntitiesAndRelationships(text);
    if (entities.size === 0) {
      return res.status(200).json({ message: 'No new entities found.' });
    }
    let triples = '';
    entities.forEach((type, name) => {
      const sanitizedName = name.replace(/\s/g, '_');
      triples += `
        <${SKG}${sanitizedName}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <${SKG}${type}> .
        <${SKG}${sanitizedName}> <${SKG}hasName> "${name}" .
      `;
    });
    relationships.forEach(({ source, target, type }) => {
      const sanitizedSource = source.replace(/\s/g, '_');
      const sanitizedTarget = target.replace(/\s/g, '_');
      triples += `<${SKG}${sanitizedSource}> <${SKG}${type}> <${SKG}${sanitizedTarget}> .`;
    });
    const query = `INSERT DATA { ${triples} }`;
    await client.query.update(query);
    res.status(200).json({ message: 'Data ingested successfully' });
  } catch (error) {
    console.error('Ingestion error:', error);
    res.status(500).json({ message: 'Failed to ingest data' });
  }
});

export default router;