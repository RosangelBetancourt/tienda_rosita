function elminarDeUnArray(array, objeto) {
    for (let i = 0; i < array.length; i++) {
        if (objeto === array[i]) {
            array.splice(i, 1)
            return array
        }
    }

    return true
}

module.exports = { elminarDeUnArray }