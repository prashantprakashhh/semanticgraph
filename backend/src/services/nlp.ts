// A very basic NLP placeholder service
export const extractEntitiesAndRelationships = (text: string) => {
    const entities = new Map<string, string>();
    const relationships = [];
  
    // Rule: Capitalized words are potential entities (Person/Organization)
    const capitalizedWords = text.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g) || [];
    capitalizedWords.forEach(word => {
      if (!entities.has(word)) {
        // Simple heuristic: if it contains "inc" or "llc", it's an org
        const type = word.toLowerCase().includes('inc') || word.toLowerCase().includes('llc') ? 'Organization' : 'Person';
        entities.set(word, type);
      }
    });
  
    // Rule: "works at" relationship
    const worksAtMatches = text.match(/(\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b)\s+works at\s+(\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b)/g) || [];
    worksAtMatches.forEach(match => {
      const [person, organization] = match.replace(' works at ', '|').split('|');
      relationships.push({
        source: person,
        target: organization,
        type: 'worksAt'
      });
      entities.set(person, 'Person');
      entities.set(organization, 'Organization');
    });
  
    return { entities, relationships };
  };