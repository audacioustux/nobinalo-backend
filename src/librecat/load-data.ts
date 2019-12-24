import fs from 'fs';
import path from 'path';
import * as esConnection from './connection';

function Must(val: any) {
    if (!val) throw Error('');
    return val;
}

function parseBookFile(filePath: string) {
    const book = fs.readFileSync(filePath, 'utf8');

    const title = Must(book.match(/^Title:\s(.+)$/m))[1];
    const authorMatch = book.match(/^Author:\s(.+)$/m);
    const author = !authorMatch || authorMatch[1].trim() === '' ? 'Unknown Author' : authorMatch[1];

    const _lastModified =
        book.match(/^Last Updated:\s(.+)$/m) || book.match(/^Release Date:\s(.+)$/m);
    let lastModified: Date = new Date();
    try {
        lastModified = new Date(Must(_lastModified)[1]);
    } catch (e) {}

    console.log(`Reading Book - ${title} By ${author}`);

    // Find Guttenberg metadata header and footer
    const startOfBookMatch = Must(
        book.match(/^\*{3}\s*START OF (THIS|THE) PROJECT GUTENBERG EBOOK.+\*{3}$/m),
    );

    const startOfBookIndex = startOfBookMatch.index + startOfBookMatch[0].length;
    const endOfBookIndex = Must(
        book.match(/^\*{3}\s*END OF (THIS|THE) PROJECT GUTENBERG EBOOK.+\*{3}$/m),
    ).index;

    // Clean book text and split into array of paragraphs
    const paragraphs = book
        .slice(startOfBookIndex, endOfBookIndex) // Remove Guttenberg header and footer
        .split(/\n\s+\n/g) // Split each paragraph into it's own array entry
        .map(line => line.replace(/\r\n/g, ' ').trim()) // Remove paragraph line breaks and whitespace
        .map(line => line.replace(/_/g, '')) // Guttenberg uses "_" to signify italics.  We'll remove it, since it makes the raw text look messy.
        .filter(line => line && line !== ''); // Remove empty lines

    console.log(`Parsed ${paragraphs.length} Paragraphs\n`);
    return { title, author, paragraphs, filePath, lastModified };
}

async function insertBookData(
    title: string,
    author: string,
    paragraphs: string[],
    filePath: string,
    lastModified: Date,
) {
    let bulkOps = [];

    for (let i = 0; i < paragraphs.length; i++) {
        bulkOps.push({ index: { _index: esConnection.index, _type: esConnection.type } });

        bulkOps.push({
            author,
            title,
            location: i,
            text: paragraphs[i],
            filePath,
            lastModified,
        });

        if (i > 0 && i % 500 === 0) {
            await esConnection.client.bulk({ body: bulkOps });
            bulkOps = [];
            console.log(`Indexed Paragraphs ${i - 499} - ${i}`);
        }
    }

    await esConnection.client.bulk({ body: bulkOps });
    console.log(
        `Indexed Paragraphs ${paragraphs.length - bulkOps.length / 2} - ${paragraphs.length}\n\n\n`,
    );
}

async function readAndInsertBooks() {
    try {
        await esConnection.resetIndex();

        const files = fs.readdirSync('./books').filter(file => file.slice(-4) === '.txt');
        console.log(`Found ${files.length} Files`);

        for (const file of files) {
            console.log(`Reading File - ${file}`);
            const filePath = path.join('./books', file);
            const { title, author, paragraphs, lastModified } = parseBookFile(filePath);
            await insertBookData(title, author, paragraphs, filePath, lastModified);
        }
    } catch (err) {
        console.error(err);
    }
}

export { parseBookFile };
// esConnection.resetIndex().then(() => readAndInsertBooks());
