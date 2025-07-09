import { Router } from 'express';
import { config } from '../config';

const router = Router();
const SKG = 'http://semantic-knowledge-graph.org/ontology#';

// --- FINAL, MORE PRECISE NLP LOGIC ---

const toUriSafe = (text: string): string => {
    return text.trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
};

const extractData = (text: string) => {
    const entities = new Map<string, string>();
    const relationships: { subject: string; predicate: string; object: string }[] = [];

    // Pattern 1: Find "X is the founder of Y"
    // This pattern is specific and looks for the 'founder' keyword.
    const founderPattern = /([A-Z][a-zA-Z\s]+?)\s+is\s+the\s+founder\s+of\s+([A-Z][a-zA-Z\s]+)/i;
    const founderMatch = text.match(founderPattern);
    if (founderMatch) {
        const subject = founderMatch[1].trim();
        const object = founderMatch[2].trim();
        
        entities.set(subject, 'Person');
        entities.set(object, 'Organization');
        relationships.push({ subject, predicate: 'founder_of', object });
    }

    // Pattern 2: Find "X, which is located in Y"
    // **THE FIX IS HERE:** This regex is more specific and non-greedy.
    // It captures only the word/phrase immediately before the comma.
    const locationPattern = /(\w+),\s+which\s+is\s+located\s+in\s+([A-Z][a-zA-Z\s]+)/i;
    const locationMatch = text.match(locationPattern);
    if (locationMatch) {
        const subject = locationMatch[1].trim();
        const object = locationMatch[2].trim();

        // Avoid re-typing if the entity already exists
        if (!entities.has(subject)) {
            entities.set(subject, 'Organization');
        }
        entities.set(object, 'Location');
        relationships.push({ subject, predicate: 'located_in', object });
    }
    
    return { entities, relationships };
};

// --- ROUTE HANDLER ---
router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
        return res.status(400).json({ message: 'Text is required' });
    }
    console.log('[INGEST] Processing text:', text);

    try {
        const { entities, relationships } = extractData(text);

        if (entities.size === 0 && relationships.length === 0) {
            return res.status(200).json({ message: 'No meaningful entities or relationships found.' });
        }

        let triples = '';
        entities.forEach((type, name) => {
            const entityUri = toUriSafe(name);
            triples += `skg:${entityUri} rdf:type skg:${type} . skg:${entityUri} skg:hasName "${name.replace(/"/g, '\\"')}" . `;
        });

        relationships.forEach(rel => {
            const subjectUri = toUriSafe(rel.subject);
            const objectUri = toUriSafe(rel.object);
            triples += `skg:${subjectUri} skg:${rel.predicate} skg:${objectUri} . `;
        });

        const sparqlUpdate = `PREFIX skg: <${SKG}> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> INSERT DATA { ${triples} }`;
        
        const response = await fetch(`${config.databaseUrl}/statements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `update=${encodeURIComponent(sparqlUpdate)}`
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Database update failed with status ${response.status}: ${errorBody}`);
        }

        console.log(`[INGEST] Successfully ingested data.`);
        res.status(200).json({ message: 'Data ingested successfully' });

    } catch (error: any) {
        console.error('[INGEST] Error processing text:', error);
        res.status(500).json({ message: 'Failed to process text', error: error.message });
    }
});

export default router;