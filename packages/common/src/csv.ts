// https://www.ietf.org/rfc/rfc4180.txt

export function parseCSV<Elem extends Record<string, string>>(csv: string) {
    const res: Elem[] = [];
    const table = csv
        .trim()
        .split("\n")
        .map(line => line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));

    const header = table[0];

    for (let i = 1; i < table.length; i++) {
        if (table[i].length !== header.length) {
            throw new Error(
                `Row ${i} has ${table[i].length} columns, but the header has ${header.length} columns.`
            );
        }
        const row: Record<string, string> = {};
        for (let j = 0; j < header.length; j++) {
            row[header[j]] = table[i][j];
        }
        res.push(row as Elem);
    }

    return res;
}

export function serializeCSV<Elem extends Record<string, string>>(data: Elem[]) {
    const header: string[] = [];

    // push all available keys to header
    for (const entry of data) {
        for (const k in entry) {
            if (!header.includes(k)) header.push(k);
        }
    }

    const formatted = data.map(entry =>
        header.map(k => (entry as Record<string, string | number>)[k] || "")
    );
    const result = header.join(",") + "\n" + formatted.map(r => r.join(",")).join("\n");
    return result;
}
