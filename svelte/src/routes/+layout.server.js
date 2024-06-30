import fs from 'fs';

/** @type {import('./$types').PageLoad} */
export function load() {
    const routes = fs.readdirSync('src/routes')
        .filter((name) => name.charAt(0) !== '+');

    return {
        routes
    }
}
