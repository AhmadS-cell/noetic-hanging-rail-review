import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
async function check(dir) {
  let count=0;
  for(const entry of await readdir(dir,{withFileTypes:true})) {
    const p=path.join(dir,entry.name);
    if(entry.isDirectory()){count+=await check(p);continue;}
    if(!p.endsWith('.html'))continue;
    const html=await readFile(p,'utf8');
    if(!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html))throw Error(p+': missing noindex');
    count++;
  }
  return count;
}
const count=await check(fileURLToPath(new URL('../docs/',import.meta.url)));
if(count<2)throw Error('Expected index and error page');
console.log('PASS: noindex on '+count+' HTML pages.');
