import { Router } from 'express';
import search from './search';
import UUID from 'uuid';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import { parseBookFile } from './load-data';
import axios from 'axios';

const router = Router();

router.get('/search', async (req, res) => {
    const { offset, q } = req.query;
    try {
        res.json(await (await search.queryTerm(q, offset)).body);
    } catch (e) {
        res.statusCode = 401;
        res.json({ e });
    }
});

interface User {
    uuid: string;
    name: string;
    email: string;
    password: string;
}
const users: User[] = [];

function createAuthToken(uuid: string, name: string) {
    return jwt.sign({ uuid, name }, 'blabla');
}
function authenticate(token: string) {
    try {
        jwt.verify(token, 'blabla');
        return true;
    } catch {
        return false;
    }
}

router.get('/login', async (req, res) => {
    const { email, password } = req.query;
    const user = users.filter(val => {
        return val.email == email && val.password == password;
    });
    res.send(createAuthToken(user[0].uuid, user[0].name));
});

router.get(
    '/signup',
    [
        check('email').isEmail(),
        check('password').isLength({ min: 5 }),
        check('name').isLength({ min: 3 }),
    ],
    async (req: any, res: any) => {
        const { name, password, email } = req.query;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }

        if (
            users.filter(val => {
                return val.email == email;
            }).length !== 0
        ) {
            res.statusCode = 401;
            res.send('email already exist!');
        }
        const uuid = UUID.v4();
        users.push({
            name,
            email,
            password,
            uuid,
        });
        res.send(createAuthToken(uuid, name));
        console.log(users);
    },
);

router.get('/detail', async (req, res) => {
    const { filePath } = req.query;

    const { title, author, lastModified, paragraphs } = parseBookFile(filePath);
    let gDetail: { data: Record<string, any> } = { data: {} };
    try {
        gDetail = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&filter=free-ebooks&projection=lite`,
        );
    } catch (e) {
        console.error(e);
    }

    let thumbnail = '';
    if (
        gDetail.data &&
        gDetail.data.items &&
        gDetail.data.items[0] &&
        gDetail.data.items[0].volumeInfo &&
        gDetail.data.items[0].volumeInfo.imageLinks
    ) {
        thumbnail = gDetail.data.items[0].volumeInfo.imageLinks.thumbnail;
    }
    res.json({
        title,
        author,
        lastModified,
        description: paragraphs.slice(0, 4).join('\n'),
        thumbnail,
        // gDetail,
    });
});

const voteLog: { [s: string]: number } = {
    'books/1228.txt': 2, 
    'books/10.txt': 2,
};

router.get('/voteUp', async (req, res) => {
    const { token, filePath } = req.query;
    if (authenticate(token)) {
        voteLog[filePath] ? (voteLog[filePath] += 1) : (voteLog[filePath] = 1);
        res.json(voteLog);
    } else {
        res.statusCode = 401;
        res.send('not logged in');
    }
});
router.get('/voteDown', async (req, res) => {
    const { token, filePath } = req.query;
    if (authenticate(token)) {
        voteLog[filePath] ? (voteLog[filePath] -= 1) : (voteLog[filePath] = -1);
        res.json(voteLog);
    } else {
        res.statusCode = 401;
        res.send('not logged in');
    }
});

router.get('/download', async (req, res) => {
    const { path } = req.query;
    res.download(path);
});

router.get('/popular', async (req, res) => {
    const sortedBooksbyVote = Object.keys(voteLog).sort(function(a, b) {
        return voteLog[b] - voteLog[a];
    });
    res.json(sortedBooksbyVote.slice(0, 5));
});

// router.get('/recent', async (req, res) => {});
// router.get('/trending', async (req, res) => {});

export default router;
