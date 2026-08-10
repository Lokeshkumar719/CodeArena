const AdmZip = require('adm-zip');

const extractHiddenTestcasesFromZip = (buffer) => {
  const zip = new AdmZip(buffer);

  const entries = zip.getEntries();

  const inputFiles = {};
  const outputFiles = {};

  for (const entry of entries) {
    if (entry.isDirectory) continue;

    const name = entry.entryName.split('/').pop();

    if (!name) continue;

    if (name.endsWith('.in')) {
      const testNo = name.replace('.in', '');

      inputFiles[testNo] = zip.readAsText(entry).trimEnd();
    }

    if (name.endsWith('.out')) {
      const testNo = name.replace('.out', '');

      outputFiles[testNo] = zip.readAsText(entry).trimEnd();
    }
  }

  const hiddenTestCases = [];

  for (const testNo of Object.keys(inputFiles).sort((a, b) => Number(a) - Number(b))) {
    if (!outputFiles[testNo]) {
      throw new Error(`Missing output file for testcase ${testNo}`);
    }

    hiddenTestCases.push({
      input: inputFiles[testNo],
      output: outputFiles[testNo],
    });
  }

  return hiddenTestCases;
};

module.exports = extractHiddenTestcasesFromZip;
