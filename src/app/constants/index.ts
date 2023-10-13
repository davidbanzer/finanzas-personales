export const headersWithToken = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
}

export const headersWithoutToken = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

