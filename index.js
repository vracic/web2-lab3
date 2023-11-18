const canvas = document.querySelector('canvas') // dohvaćanje canvas elementa iz html dokumenta
const ctx = canvas.getContext('2d')

// postavljanje visine i širine canvasa na visinu i širinu cijelog prozora
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// crtanje crnog pravokutnika preko cijelog canvasa
ctx.fillStyle = "black"
ctx.fillRect(0, 0, canvas.width, canvas.height)

// konstanta za brzinu
const SPEED = 3

// polje asteroida
const asteroids = []

// pocetno vrijeme
const startTime = new Date()
let time

// objekt koji koristimo za tipke na tipkovnici pomoću kojih igramo igru
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    s: {
        pressed: false
    }
}

// klasa za igrača
class Player {
    constructor(velocity) { // inicijalno postavljanje pozicije (sredina canvasa) i brzine (0) igrača u konstruktoru 
        this.position = {
            x: (canvas.width / 2) - 25,
            y: (canvas.height / 2) - 25
        }
        this.velocity = velocity
    }

    draw() { // metoda za crtanje igrača
        ctx.fillStyle = "red" // crtanje igrača
        ctx.shadowBlur = 10
        ctx.shadowColor = "white"
        ctx.fillRect(this.position.x, this.position.y, 50, 50)
    }

    update() { // metoda koja se konstantno zove kako bi se igrač "kretao"
        this.draw() // tj. u svakom frame-u će igrač biti u drugoj poziciji ovisno o tome koja tipka je pritisnuta
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Asteroid {
    constructor({
        position,
        velocity,
        size
    }) {
        this.position = position
        this.velocity = velocity
        this.size = size
        // random nijansa sive
        this.color = Math.random() * 255
    }

    // crtanje asteroida
    draw() {
        ctx.shadowBlur = 20
        ctx.shadowColor = "white"
        ctx.fillStyle = "rgb(" + this.color + ", " + this.color + ", " + this.color + ")"
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

// inicijalizacija igrača
const player = new Player({x: 0,y: 0})

// početno crtanje igrača
player.draw()

// na početku igre stvara se 10 asteroida
for (var i = 0; i < 10; i++) {
    createNewAsteroid()
}

// svakih 250ms stvara se novi asteroid
const intervalId = window.setInterval(() => {
    createNewAsteroid()
}, 250)

function createNewAsteroid() {
    const side = Math.floor(Math.random() * 4) //random strana na kojoj ce se stvoriti asteroid
    let x, y
    let vel_x, vel_y
    const size = 100 * Math.random() + 50 // random velicina
    let angle
    const vel = Math.random() * 5 // random brzina asteroida

    // ovisno o random strani koju dobimo smjer kretanja biti ce random, ali takav da asteroid krene prema canvasu, a ne od njega
    // npr. ako strana bude lijeva asteroid nece moci ici u negativnom smjeru po x osi

    switch (side) {
        case 0: // lijevo
            angle = Math.random() * Math.PI - Math.PI / 2       // random kut iz prvog ili četvrtog kvadranta
            x = 0 - size
            y = Math.random() * canvas.height
            vel_x = Math.cos(angle) * vel
            vel_y = Math.sin(angle) * vel
            break
        case 1: // gore
            angle = Math.random() * Math.PI                     // random kut iz prvog ili drugog kvadranta
            x = Math.random() * canvas.width
            y = 0 - size
            vel_x = Math.cos(angle) * vel
            vel_y = Math.sin(angle) * vel
            break
        case 2: // desno    
            angle = Math.random() * Math.PI + Math.PI / 2       // random kut iz drugog ili trećeg kvadranta
            x = canvas.width + size
            y = Math.random() * canvas.height
            vel_x = Math.cos(angle) * vel
            vel_y = Math.sin(angle) * vel
            break
        case 3: // dolje
            angle = -Math.random() * Math.PI                    // random kut iz trećeg ili četvrtog kvadranta
            x = Math.random() * canvas.width
            y = canvas.height + size
            vel_x = Math.cos(angle) * vel
            vel_y = Math.sin(angle) * vel
            break
    }

    asteroids.push(new Asteroid({
        position: {
            x: x,
            y: y,
        },
        velocity: {
            x: vel_x,
            y: vel_y,
        },
        size,
    }))
}

function collision(asteroid, pl) {
    // ako je jedan od vrhova igraca unutar asteroida funkcija vraca true inace false
    const x = pl.position.x
    const y = pl.position.y
    const asteroid_x = asteroid.position.x
    const asteroid_y = asteroid.position.y
    const asteroid_size = asteroid.size
    // top left
    if (x >= asteroid_x && x <= asteroid_x + asteroid_size && y >= asteroid_y && y <= asteroid_y + asteroid_size) return true
    // top right
    if (x >= asteroid_x && x <= asteroid_x + asteroid_size && y + 50 >= asteroid_y && y + 50 <= asteroid_y + asteroid_size) return true
    // bottton left
    if (x + 50 >= asteroid_x && x + 50 <= asteroid_x + asteroid_size && y >= asteroid_y && y <= asteroid_y + asteroid_size) return true
    // bottom right
    if (x + 50 >= asteroid_x && x + 50 <= asteroid_x + asteroid_size && y + 50 >= asteroid_y && y + 50 <= asteroid_y + asteroid_size) return true

    return false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate) // metoda koja pregledniku kaže da želimo animaciju
    // argument metode je funkcija koju želimo pozvati kada je vrijeme za crtanje novog frame-a animacije
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height) // resetiranje canvasa

    // ispis vremena
    time = new Date() - startTime
    const minutes = Math.floor(time / 1000 / 60)
    const seconds = Math.floor(time / 1000 - minutes * 60)
    const milliseconds = Math.floor(time - minutes * 60 * 1000 - seconds * 1000)
    const storedTime = localStorage?.bestTime
    const minutesBest = Math.floor(storedTime / 1000 / 60)
    const secondsBest = Math.floor(storedTime / 1000 - minutesBest * 60)
    const millisecondsBest = Math.floor(storedTime - minutesBest * 60 * 1000 - secondsBest * 1000)

    ctx.font = "30px Arial"
    ctx.textAlign = "end"
    ctx.fillStyle = "white"
    ctx.fillText("Best time: " + minutesBest + ":" + secondsBest + "." + millisecondsBest, canvas.width - 50, 50)
    ctx.fillText("time: " + minutes + ":" + seconds + "." + milliseconds, canvas.width - 50, 100)

    player.update() // ponovno crtanje igrača

    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i]
        asteroid.update()

        if (collision(asteroid, player)) {              // provjera je li došlo do kolizije za svaki asteroid
            console.log('GAME OVER')
            console.log(minutes + ":" + seconds + "." + milliseconds)
            window.cancelAnimationFrame(animationId)
            clearInterval(intervalId)

            if (typeof (Storage) !== "undefined") {
                const bestTime = localStorage.bestTime
                if (!bestTime || time > bestTime) localStorage.bestTime = time
            } else {
                console.log('Sorry! No Web Storage support..')
            }
        }

        // brisanje asteroida kada izađu iz canvasa
        if (
            asteroid.position.x + asteroid.size < 0 ||
            asteroid.position.x - asteroid.size > canvas.width ||
            asteroid.position.y - asteroid.size > canvas.height ||
            asteroid.position.y + asteroid.size < 0
        ) {
            asteroids.splice(i, 1)
        }
    }

    // postavljanje brzine ovisno o pritisnutim tipkama

    player.velocity.x = 0
    player.velocity.y = 0

    if (keys.w.pressed && !keys.s.pressed && player.position.y > 0) {
        player.velocity.y = -SPEED
    }
    if (!keys.w.pressed && keys.s.pressed && player.position.y < canvas.height - 50) {
        player.velocity.y = SPEED
    }
    if (keys.a.pressed && !keys.d.pressed && player.position.x > 0) {
        player.velocity.x = -SPEED
    }
    if (!keys.a.pressed && keys.d.pressed && player.position.x < canvas.width - 50) {
        player.velocity.x = SPEED
    }
}

animate()


// event listeneri pomoću kojih znamo kada je određena tipka pritisnuta a kada ne

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = true
            break
        case 'KeyA':
            keys.a.pressed = true
            break
        case 'KeyD':
            keys.d.pressed = true
            break
        case 'KeyS':
            keys.s.pressed = true
            break
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = false
            break
        case 'KeyA':
            keys.a.pressed = false
            break
        case 'KeyD':
            keys.d.pressed = false
            break
        case 'KeyS':
            keys.s.pressed = false
            break
    }
})