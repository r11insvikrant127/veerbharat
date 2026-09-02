import { discoverResearchSources, printSourceDiscovery } from './scripts/data-entry/research/sourceDiscovery.js';

// Helper function for delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testHeroes(): Promise<void> {
  const heroes: Array<{type: string, name: string}> = [
    { type: 'hero', name: 'Lachit Borphukan' },
    { type: 'hero', name: 'Shivaji Maharaj' },
    { type: 'hero', name: 'Rani Lakshmibai' },
    { type: 'hero', name: 'Bhagat Singh' },
    { type: 'hero', name: 'Subhas Chandra Bose' },
    { type: 'hero', name: 'Sardar Vallabhbhai Patel' },
  ];

  const results: Array<any> = [];

  for (let i = 0; i < heroes.length; i++) {
    const hero = heroes[i];
    
    console.log('\n\n' + '='.repeat(70));
    console.log(`TESTING (${i + 1}/${heroes.length}): ${hero.name}`);
    console.log('='.repeat(70));
    
    try {
      const result = await discoverResearchSources(hero.type as any, hero.name);
      printSourceDiscovery(result);
      
      results.push({
        name: hero.name,
        regionHints: result.regionHints,
        subjectHints: result.subjectHints,
        sourceCount: result.sources.length,
        identity: result.identityContext
      });
    } catch (error) {
      console.error('Error testing ' + hero.name + ':', error);
      results.push({
        name: hero.name,
        error: String(error)
      });
    }
    
    // Add delay between heroes to avoid rate limiting
    // Start with 20 seconds, increase if you still get 429 errors
    if (i < heroes.length - 1) {
      console.log(`\n⏳ Waiting 20 seconds before next hero to avoid rate limiting...`);
      await delay(20000);
    }
  }

  console.log('\n\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log('\nHero                    Region          Sources     Birth Place');
  console.log('-'.repeat(70));
  
  for (const r of results) {
    if (r.error) {
      console.log(r.name.padEnd(20) + '\tERROR: ' + r.error);
    } else {
      const region = r.regionHints.join(', ') || 'NONE';
      const birth = r.identity?.birthPlace || 'Unknown';
      console.log(r.name.padEnd(20) + '\t' + region.padEnd(14) + '\t' + r.sourceCount + '\t\t' + birth);
    }
  }
  
  // Additional summary statistics
  console.log('\n\n' + '='.repeat(70));
  console.log('STATISTICS');
  console.log('='.repeat(70));
  
  const successCount = results.filter(r => !r.error).length;
  const withRegion = results.filter(r => r.regionHints && r.regionHints.length > 0).length;
  const withBirth = results.filter(r => r.identity?.birthPlace && r.identity.birthPlace !== 'Unknown').length;
  
  console.log(`Total Heroes: ${results.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${results.length - successCount}`);
  console.log(`With Region Detected: ${withRegion}`);
  console.log(`With Birth Place Found: ${withBirth}`);
  console.log(`Success Rate: ${Math.round((successCount / results.length) * 100)}%`);
}

testHeroes();