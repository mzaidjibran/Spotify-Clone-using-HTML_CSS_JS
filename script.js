console.log("Let's write some JavaScript");


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.textContent.trim())
        }

    }
    return songs
}

getSongs()

async function main() {
    // Get the list of songs.

    let songs = await getSongs()
    console.log(songs)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                        <img src="music.svg" class="invert">
                        <div class="info">
                            <div>
                                 ${song}
                            </div>
                            <div>Zaid</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img src="play.svg" class="invert">
                        </div>
    </li>`;
    }

    //Play 1st song 
    var audio = new Audio(songs[0]);

    // audio.play();
    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currenttime)
    });

}

main()


