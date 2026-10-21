const REMOTE_OK_API = "https://remoteok.com/api"

async function fetchRemoteJobs() {
    const response = awaitfetch(REMOTE_OK_API)

    if(!response.ok) {
        throw new Error("unable to fetch rempte jobs.")
    }

    const data = await response.json()

    if(!Array.isArray(data)){
        throw new Error("The API returned an invalid response")
    }


    return data.filter((job) => job && job.id && job.position)
}

export{fetchRemoteJobs}