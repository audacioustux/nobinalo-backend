import Mailer from './type';


function getConfig(): Mailer {
    if (process.env.NODE_ENV !== 'production') {
        return require('./dev').default;
    }
    return require('./prod').default;
}

const mailer = getConfig();

export default mailer;
export { mailer, Mailer };
