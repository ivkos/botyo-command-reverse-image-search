export default interface UrlShortener
{
    shorten(url: string): Promise<string>;
}