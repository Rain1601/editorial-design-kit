import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validatePalette} from '../assets/editorial/palette-presets.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
test('entry styles and recursive ES module imports resolve under a GitHub Pages subdirectory',()=>{
 const html=readFileSync(resolve(root,'agent-task.html'),'utf8');const pending=[];
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){assert.ok(match[1].startsWith('./'),`Relative URL required: ${match[1]}`);const path=resolve(root,match[1]);assert.ok(existsSync(path),`Missing asset: ${path}`);if(path.endsWith('.mjs'))pending.push(path);}
 const seen=new Set();while(pending.length){const file=pending.pop();if(seen.has(file))continue;seen.add(file);const source=readFileSync(file,'utf8');for(const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)){assert.ok(match[1].startsWith('./'),`Portable import required: ${match[1]}`);const path=resolve(dirname(file),match[1].split('?')[0]);assert.ok(existsSync(path),`Missing module: ${path}`);pending.push(path);}}
 assert.ok(seen.size>=6,'Real skill module graph is included');
});
test('both reused Paper palettes pass the skill text contrast checks',()=>{for(const palette of ['paper','paper-night'])assert.ok(validatePalette(palette));});
test('vendored skill assets are exact copies of published skill resources',()=>{for(const file of ['choice-switch.mjs','choice-switch.css','palette-presets.mjs','tokens.mjs','theme-contrast.mjs','agent-components.mjs','agent-components.css','agent-input.mjs','agent-execution.mjs','agent-approval.mjs','agent-artifacts.mjs','motion.mjs'])assert.equal(readFileSync(resolve(root,'assets/editorial',file),'utf8'),readFileSync(resolve(root,'../../skills/editorial-design/assets/editorial',file),'utf8'));});
