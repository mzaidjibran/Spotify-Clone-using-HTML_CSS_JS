console.log("Let's write some JavaScript");

let songs = [];
let currFolder;

let currentSongs = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.textContent.trim())
        }

    }
    // Show all the songs in the playlist
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

    //attach event listner to each song.
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs
}

getSongs()

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSongs.src = `/${currFolder}/` + track
    if (!pause) {
        currentSongs.play()
        play.src = "pause.svg"
    }


    document.querySelector(".songInfo").innerHTML = track
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}

async function main() {

    // Get the list of songs.

    songs = await getSongs("songs/cs")
    playMusic(songs[0], true)




    //attach event listner to play,next and previous buttons

    play.addEventListener("click", () => {
        if (currentSongs.paused) {
            currentSongs.play()
            play.src = "pause.svg"
        }
        else {
            currentSongs.pause()
            play.src = "play.svg"
        }
    }
    )
    //time update event

    currentSongs.addEventListener("timeupdate", () => {
        console.log(currentSongs.currentTime, currentSongs.duration);
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSongs.currentTime)} / ${secondsToMinutesSeconds(currentSongs.duration)}`
        document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.duration) * 100 + "%";
    })

    //add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSongs.currentTime = ((currentSongs.duration) * percent) / 100
    })

    //Add an event listner to hamberg

    const leftBox = document.querySelector(".left_box");

    document.querySelector(".hamburger").addEventListener("click", () => {
        leftBox.classList.add("active");
    });

    document.querySelector(".close").addEventListener("click", () => {
        leftBox.classList.remove("active");
    });

    const hamburger = document.querySelector(".hamburger");
    const lefttBox = document.querySelector(".left_box");

    hamburger.addEventListener("click", () => {
        leftBox.classList.add("active");
        hamburger.style.display = "none";
    });

    document.querySelector(".close").addEventListener("click", () => {
        leftBox.classList.remove("active");
        hamburger.style.display = "block";
    });

    previous.addEventListener("click", () => {
        console.log(currentSongs)
        let currentFile = decodeURIComponent(currentSongs.src.split("/").pop());
        let index = songs.indexOf(currentFile);

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    });

    next.addEventListener("click", () => {
        console.log(currentSongs)
        let currentFile = decodeURIComponent(currentSongs.src.split("/").pop());
        let index = songs.indexOf(currentFile);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    }

    );


}

main()


