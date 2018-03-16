import UrlShortener from "./UrlShortener";

export default class IdentityUrlShortener implements UrlShortener
{
    shorten(url: string): Promise<string>
    {
        return Promise.resolve(url);
    }
}