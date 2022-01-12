/**
 * 1.Render songs
 * 2.Scroll top
 * 3.Play / pause / seek
 * 4.CD rotate
 * 5.Next / prev
 * 6.Random
 * 7.Next / Repeat when ended
 * 8.Active song
 * 9.Scroll active song into view
 * 10.Play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const playlist = $('.playlist')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const header = $('header h2')
const audio = $('#audio')
const playBtn = $('.btn.btn-toggle-play')
const progress = $('#progress')

const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [
        {
            name: "Tabun",
            singer: "Yoasobi",
            path: "https://data3.chiasenhac.com/downloads/2104/3/2103221-a04f66b5/128/Tabun%20-%20YOASOBI.mp3",
            image: "https://scontent-nrt1-1.xx.fbcdn.net/v/t1.6435-9/151820793_183974896853061_3423769821827953030_n.jpg?_nc_cat=103&ccb=1-5&_nc_sid=0debeb&_nc_ohc=OfDxaDed_JoAX_duCet&_nc_ht=scontent-nrt1-1.xx&oh=00_AT8rDskftYtJ17EwVMHee3M_dzvMievKkXeL0VkX6LvTyA&oe=6204C2D8"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "https://mp3.vlcmusic.com/download.php?track_id=34213&format=320",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path:
                "https://mp3.filmysongs.in/download.php?id=Naachne Ka Shaunq Raftaar Ft Brodha V Mp3 Hindi Song Filmysongs.co.mp3",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "https://mp3.vlcmusic.com/download.php?track_id=14448&format=320",
            image:
                "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
            image:
                "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
                "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
            image:
                "https://images.unsplash.com/photo-1641974747505-b8e77b521aa9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
            image:
                "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        thisObj = this
        const cdWidth = cd.offsetWidth
        // Xử lý phóng to, thu nhỏ cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 10 ? newCdWidth + "px" : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // Xử lý khi click play button
        playBtn.onclick = function () {
            if (thisObj.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
            // Khi song được play
            audio.onplay = function () {
                thisObj.isPlaying = true
                player.classList.add('playing')
            }
            // Khi song bị pause
            audio.onpause = function () {
                thisObj.isPlaying = false
                player.classList.remove('playing')
            }
            // Tiến độ bài hát thay đổi
            audio.ontimeupdate = function () {
                if (audio.duration) {
                    const progressPercentage = Math.floor((audio.currentTime / audio.duration) * 100)
                    progress.value = progressPercentage
                }
            }
            // Xử lý khi tua bài hát ( dùng input thay change để fix bug )
            progress.oninput = function (e) {
                const seekTime = (audio.duration * e.target.value) / 100
                audio.currentTime = seekTime
            }
        }

    },
    render: function () {
        const htmls = this.songs.map((song) => {
            return `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    loadCurrentSong: function () {
        header.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    start: function () {
        // Định nghĩa các thuộc tính
        this.defineProperties()
        // Xử lý các sự kiện DOM
        this.handleEvents()
        // Render UI bài hát đầu tiên khi app chạy
        this.loadCurrentSong()
        // Render các bài hát playlist
        this.render()
    }
}
app.start()