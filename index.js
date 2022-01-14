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
const dashboard = $('.dashboard')
const playlist = $('.playlist')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const header = $('header h2')
const audio = $('#audio')
const playBtn = $('.btn.btn-toggle-play')
const nextBtn = $('.btn.btn-next')
const prevBtn = $('.btn.btn-prev')
const randomBtn = $('.btn.btn-random')
const repeatBtn = $('.btn.btn-repeat')
const progress = $('#progress')
const cdInner = $('.cd-inner')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "たぶん",
            singer: "Yoasobi",
            path: "./Yoasobi/audio/Tabun.mp3",
            image: "./Yoasobi/img/Tabun.jpg"
        },
        {
            name: "夜に駆ける",
            singer: "Yoasobi",
            path: "./Yoasobi/audio/Yoru-ni-kakeru.mp3",
            image: "./Yoasobi/img/Yoru-ni-kakeru.jpg"
        },
        {
            name: "アンコール",
            singer: "Yoasobi",
            path: "./Yoasobi/audio/Ankoru.mp3",
            image: "./Yoasobi/img/Ankoru.jpg"
        },
        {
            name: "あの夢をなぞって",
            singer: "Yoasobi",
            path: "./Yoasobi/audio/Ano-yume-wo-nazotte.mp3",
            image: "./Yoasobi/img/Ano-yume-wo-nazotte.jpg"
        },
        {
            name: "群青",
            singer: "Yoasobi",
            path: "./Yoasobi/audio/Gunjou.mp3",
            image: "./Yoasobi/img/Gunjou.jpg"
        },
        {
            name: "ハルジオン",
            singer: "Yoasobi",
            path: "./Yoasobi/audio/Harujion.mp3",
            image: "./Yoasobi/img/Harujion.jpg"
        },
        {
            name: "怪物",
            singer: "Yoasobi",
            path: "./Yoasobi/audio/Kaibutsu.mp3",
            image: "./Yoasobi/img/Kaibutsu.jpg"
        },
        {
            name: "もしも命が描けたら",
            singer: "Yoasobi",
            path: "./Yoasobi/audio/Moshimo-inochiga-egaketara.mp3",
            image: "./Yoasobi/img/Moshimo-inochiga-egaketara.jpg"
        },
        {
            name: "三原色",
            singer: "Yoasobi",
            path: "./Yoasobi/audio/Sangenshoku.mp3",
            image: "./Yoasobi/img/Sangenshoku.jpg"
        },
        {
            name: "ツバメ",
            singer: "Yoasobi",
            path: "./Yoasobi/audio/Tsubame.mp3",
            image: "./Yoasobi/img/Tsubame.jpg"
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
        _this = this
        const cdWidth = cd.offsetWidth
        // Xử lý animation quay cd
        let rotate360 = [
            { transform: 'rotate(360deg)' }
        ]
        var cdRotate360 = cdThumb.animate(rotate360, {
            duration: 10000,
            iterations: Infinity
        })
        cdRotate360.pause()
        // Xử lý animation heart beats
        document.onscroll = function () {
            // Xử lý phóng to, thu nhỏ cd
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 20 ? newCdWidth + "px" : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // Xử lý khi click play button
        playBtn.onclick = function playSong() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdInner.classList.add('active')
            cdRotate360.play()
        }
        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdInner.classList.remove('active')
            cdRotate360.pause()
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
        // Khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }
        // Khi prev bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
        }
        // Khi bật/tắt nút random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // Khi bật/tắt nút repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Khi bài hát kết thúc ( sẽ next hoặc lặp lại bài hát )
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            const optionNode = e.target.closest('.option')
            if (songNode || optionNode) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                }
                if (optionNode) {
                    console.log(optionNode);
                }
            }
        }
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song" data-index=${index}>
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
        let playlistSongs = $$('.song')
        header.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
        // Active song playlist
        for (let i = 0; i < playlistSongs.length; i++) {
            playlistSongs[i].classList.remove('active')
        }
        playlistSongs[this.currentIndex].classList.add('active')
        // Current song into view
        // setTimeout(() => {
        //     $('.song.active').scrollIntoView({
        //         behavior: 'smooth',
        //         block: 'end'
        //     })
        // }, 300)
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        audio.play()
        // Current song into view
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        audio.play()
        // Current song into view
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        // Định nghĩa các thuộc tính
        this.defineProperties()
        // Xử lý các sự kiện DOM
        this.handleEvents()
        // Render các bài hát playlist
        this.render()
        // Render UI bài hát đầu tiên khi app chạy
        this.loadCurrentSong()
    }
}
app.start()