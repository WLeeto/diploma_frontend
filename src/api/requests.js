

export const fetchRequest = async (endpoint, method, body) => {
    return await fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
}

export const fetchRequestWithAuth = async (endpoint, method, jwt) => {
    return await fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
    })
}