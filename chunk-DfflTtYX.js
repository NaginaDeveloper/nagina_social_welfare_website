function r(e){return /<[a-z][\s\S]*>/i.test(e.trim())}function t(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\n/g,"<br>")}function i(e){let n=(e??"").trim();return n?r(n)?n:t(n):""}function l(e){let n=(e??"").trim();return n?n.replace(/<br\s*\/?>/gi,`
`).replace(/<\/p>/gi,`
`).replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/\n{3,}/g,`

`).trim():""}export{i,l};