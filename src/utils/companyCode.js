const IGNORED_WORDS = [
    "PT",
    "PT.",
    "CV",
    "CV.",
    "TBK",
    "Tbk",
    "LTD",
    "INC",
    "CORP",
    "CORPORATION",
    "COMPANY",
];

export function generateCompanyCode(name = "") {

    const words = name
        .toUpperCase()
        .trim()
        .split(/\s+/)
        .filter(word => !IGNORED_WORDS.includes(word));

    if (!words.length) return "";

    // Kalau kata pertama sudah berupa singkatan (2-3 huruf)
    if (
        /^[A-Z]{2,3}$/.test(words[0])
    ) {
        return words[0];
    }

    return words
        .map(word => word[0])
        .join("");

}