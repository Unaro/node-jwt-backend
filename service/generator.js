class Generator {
    static generatePassowrd(length = 8) {

        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        let pass = ''
        const symbols = [
            'QWERTYUIOPASDFGHJKLZXCVBNM',
            'qwertyuiopasdfghjklzxcvbnm',
            '[]:.>/\\<,~`!@#$%^&*()_-+=?;}{"',
            '0123456789'
        ]

        for (let i = length; i > 0; i--) {
            let r = getRndInteger(0, symbols.length-1)
            let rj = getRndInteger(0, symbols[r].length-1)
            pass += symbols[r][rj]
        }
        return pass
    }
}

export default Generator