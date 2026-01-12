export default class Helpers {

    static preloadImages = (urls: string[]) => {
        urls.forEach(url => {
            Helpers.preloadImage(url);
        });
    }

    static preloadVideos = (urls: string[]) => {
        urls.forEach(url => {
            Helpers.preloadVideo(url);
        });
    }

    private static preloadImage = (url: string) => {
        const image = new Image(); 
        image.src = url; 
    }

    private static preloadVideo = (url: string) => {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.src = url;
    }
}
