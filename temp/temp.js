const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjc1ZDFjYjdiZDMyM2Q5NDY1OWNkZjc4N2QxMDNmYSIsIm5iZiI6MTc3ODc0MDUzNS4zNDQsInN1YiI6IjZhMDU2ZDM3NWRkNTM2YzNkZTI5MTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.b72A9zVTjK0vWAtx5VGtvWj7YYt4FiGqMcT0itpmz5I"

async function searchMovie(name) {

    const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(name)}`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    )

    const data = await response.json()

    return data
}

const movie = await searchMovie("Attack on titan")



console.log(movie)

async function searchMovie2(id) {

    const response = await fetch(
        `https://api.themoviedb.org/3/multi/${id}`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    )

    const data = await response.json()
    console.log(response)

    return data
}

const m = await searchMovie2(1429)

console.log(movie)
