import { AbstractCommandModule, Message } from "botyo-api";
import UrlShortener from "./shortener/UrlShortener";
import GooglUrlShortener from "./shortener/GooglUrlShortener";
import IdentityUrlShortener from "./shortener/IdentityUrlShortener";

export default class ReverseImageSearchCommand extends AbstractCommandModule
{
    private readonly shortener: UrlShortener;
    private readonly recentMessagesCount: number;

    constructor()
    {
        super();

        const config = this.getRuntime().getConfiguration();

        const shouldShorten = config.getOrElse("shortenUrls", false);
        if (shouldShorten) {
            const googlApiKey = config.getProperty("googlApiKey");
            this.shortener = new GooglUrlShortener(googlApiKey);
        } else {
            this.shortener = new IdentityUrlShortener();
        }

        this.recentMessagesCount = config.getOrElse("recentMessagesCount", 20);
    }

    getCommand(): string | string[]
    {
        return ["reverse", "ris", "whosthis", "whodis", "whatsthis"];
    }

    getDescription(): string
    {
        return "Runs a reverse image search on the last picture";
    }

    getUsage(): string
    {
        return "";
    }

    validate(msg: any, args: string): boolean
    {
        return true;
    }

    async execute(msg: any, args: string): Promise<any>
    {
        const lastPhotoUrl = await this.getLastPhotoUrl(msg);

        if (lastPhotoUrl) {
            const message = await this.getResultMessage(lastPhotoUrl);
            return this.getRuntime().getChatApi().sendMessage(msg.threadID, message);
        }

        return this.getRuntime().getChatApi().sendMessage(msg.threadID, "I can't see any photos :/");
    }

    private async getLastPhotoUrl(msg: Message): Promise<string | void>
    {
        const history = await this.getRuntime().getChatApi()
            .getThreadHistory(msg.threadID, this.recentMessagesCount);

        const photos = history
            .filter(m => m.attachments.length > 0)
            .filter(m => m.attachments.every((a: any) => a.type == "photo" || a.type == "image"))
            .sort((m1, m2) => m2.timestamp - m1.timestamp);

        if (photos.length === 0) {
            return;
        }

        const lastPhoto = photos[0].attachments[0];

        let url;
        try {
            url = await this.getRuntime().getChatApi().resolvePhotoUrl(lastPhoto.attachmentID);
        } catch (err) {
            url = lastPhoto.hiresUrl || lastPhoto.largePreviewUrl || lastPhoto.previewUrl || lastPhoto.thumbnailUrl;
        }

        if (!url) throw new Error("Could not get photo's URL");

        return url;
    }

    private async getResultMessage(imageUrl: string): Promise<string>
    {
        const result = await Promise.all([
            this.shortener.shorten(ReverseImageSearchCommand.getGoogleUrl(imageUrl)),
            this.shortener.shorten(ReverseImageSearchCommand.getBingUrl(imageUrl)),
            this.shortener.shorten(ReverseImageSearchCommand.getTinEyeUrl(imageUrl))
        ]);

        const googleShortUrl = result[0];
        const bingShortUrl = result[1];
        const tinEyeShortUrl = result[2];

        let text = "\u{1F50D} Reverse image search:\n\n";
        text += "\u{1F516} Google: " + googleShortUrl + " \n";
        text += "\u{1F516} Bing: " + bingShortUrl + " \n";
        text += "\u{1F516} TinEye: " + tinEyeShortUrl;

        return text;
    }

    private static getGoogleUrl(url: string)
    {
        return "https://images.google.com/searchbyimage?image_url=" + encodeURIComponent(url);
    }

    private static getBingUrl(url: string)
    {
        return "https://www.bing.com/images/search?q=imgurl:"
            + encodeURIComponent(url)
            + "&view=detailv2&selectedIndex=0&pageurl=&mode=ImageViewer&iss=sbi";
    }

    private static getTinEyeUrl(url: string)
    {
        return "https://tineye.com/search?url=" + encodeURIComponent(url);
    }
}