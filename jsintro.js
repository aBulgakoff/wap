function sum(arr) {
    return arr.filter((elem) => elem > 20).reduce((prev, elem) => prev + elem, 0)
}

function getNewArray(arr) {
    return arr.filter((elem) => elem.length >= 5 && elem.includes('a'))
}