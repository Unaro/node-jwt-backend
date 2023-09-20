export default class UserChecker {
    
    constructor(user, newInfo) {
        //console.log(user._options.include[0])
       const attributes = user._options?.attributes
       
       attributes.forEach(element => {
            if (user[element] != newInfo[element] && newInfo[element] != null) {
                this[element] = newInfo[element]
            }
       })

    }
}