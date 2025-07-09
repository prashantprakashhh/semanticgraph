import { Router } from 'express';
import { config } from '../config';

const router = Router();
const SKG = 'http://semantic-knowledge-graph.org/ontology#';

// --- NEW, MORE PRECISE NLP LOGIC ---

const toUriSafe = (text: string): string => {
    return text.trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
};

const extractData = (text: string) => {
    const entities = new Map<string, string>();
    const relationships: { subject: string; predicate: string; object: string }[] = [];

    // Define specific, non-greedy patterns
    const patterns = [
        {
            regex: /([A-Z][a-zA-Z\s]+?)\s+is\s+the\s+(founder|CEO)\s+of\s+([A-Z][a-zA-Z\s\.]+)/gi,
            predicateMap: (match: string) => match.toLowerCase() === 'ceo' ? 'is_ceo_of' : 'is_founder_of'
        },
        {
            regex: /([A-Z][a-zA-Z\s]+?),\s+which\s+is\s+located\s+in\s+([A-Z][a-zA-Z\s]+)/gi,
            predicateMap: () => 'is_located_in'
        }
    ];

    patterns.forEach(({ regex, predicateMap }) => {
        let match;
        regex.lastIndex = 0;
        while ((match = regex.exec(text)) !== null) {
            // Clean the subject and object to remove extra clauses and punctuation
            const subject = match[1].trim();
            const object = match[3] ? match[3].split(',')[0].trim().replace(/\.$/, '') : match[2].trim().replace(/\.$/, '');
            const predicate = predicateMap(match[2]);

            entities.set(subject, 'Person');
            entities.set(object, 'Organization');
            relationships.push({ subject, predicate, object });
        }
    });

    // Special handling for the location pattern which has a different structure
    const locationPattern = patterns[1].regex;
    locationPattern.lastIndex = 0;
    let locMatch;
    while ((locMatch = locationPattern.exec(text)) !== null) {
        const subject = locMatch[1].trim();
        const object = locMatch[2].trim().replace(/\.$/, '');

        entities.set(subject, 'Organization');
        entities.set(object, 'Location');
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
            return res.status(200).json({ message: 'No new entities or relationships found.' });
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