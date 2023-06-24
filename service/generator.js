class Generator {
    static generatePassowrd(length = 8) {

        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        let pass = ''
        const symbols = 'qwertyuiopasdfghjkl;zxcvbnm[]:.>/<,~`!@#$%^&*()_-+=?QWERTYUIOPASDFGHJKLZXCVBNM}{"'
        for (let i = length; i > 0; i--) {
            let r = getRndInteger(0, symbols.length-1)
            pass += symbols[r]
        }
        return pass
    }
}

export default Generator