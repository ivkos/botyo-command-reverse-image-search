import UrlShortener from "./UrlShortener";

export default class GooglUrlShortener implements UrlShortener
{
    private readonly googl: any;

    constructor(apiKey: string)
    {
        this.googl = require('goo.gl');
        this.googl.setKey(apiKey);
    }

    async shorten(url: string): Promise<string>
    {
        return Promise.resolve(this.googl.shorten(url));
    }
}