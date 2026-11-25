// Reading the research records for "Go deeper", unchanged. Pure functions of the records' text, no DOM (tested by
// test/deeper.test.js).

/** A hypothesis file (research/hypotheses/H*.md): its id, its title, Nadia's words and her shared evidence, verbatim. */
export function hypothesis(md) {
  const head = /^# (H\d)\. (.+)$/m.exec(md);
  const quote = (after) => {
    const at = md.indexOf(after);
    if (at < 0) return '';
    const rest = md.slice(at + after.length);
    const m = /\n> ([^\n]+(?:\n> [^\n]+)*)/.exec(rest);
    return m ? m[1].replace(/\n> /g, ' ').trim() : '';
  };
  return { id: head[1], title: head[2].trim(), words: quote('## Your words'), evidence: quote('**Shared evidence**') };
}

/** The current version of the application matrix: its rows (candidate, result, transfer depth, backbone support, AI slop / delusion risk) and its novelty line. */
export function currentApplications(md) {
  const start = md.indexOf('\n## Version');
  const end = md.indexOf('\n## ', start + 4);
  const block = md.slice(start, end < 0 ? undefined : end);
  const lines = block.split('\n').filter((l) => l.startsWith('|'));
  const header = lines[0].split('|').slice(1, -1).map((c) => c.trim());
  const col = (name) => header.indexOf(name);
  const rows = lines.slice(2).map((l) => {
    const c = l.split('|').slice(1, -1).map((x) => x.trim());
    return { candidate: c[col('Candidate pair')], result: c[col('Result')], depth: c[col('Transfer Depth')], support: Number(c[col('Backbone Support %')]), risk: Number(c[col('AI Slop / Delusion Risk %')]) };
  });
  const novelty = (/\*\*Novelty\.\*\* ([^\n]+(?:\n[^\n#|*][^\n]*)*)/.exec(block)?.[1] ?? '').replace(/\n/g, ' ').trim();
  return { title: /## (Version [^\n]+)/.exec(block)[1], rows, novelty };
}
