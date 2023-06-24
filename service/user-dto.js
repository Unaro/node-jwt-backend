export default class UserDto {
    reportCard
    id
    constructor({reportCard, id}) {
        this.id = id
        this.reportCard = reportCard
    }
}