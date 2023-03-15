let persons, date, phone, firstName, lastName, company, reason, email, room;

export function requestMeetingRoom () {
    const numberOfPeople = document.getElementById('numberOfPeople');
    const eventDate = document.getElementById('dateEvent');
    eventDate.min = new Date().toISOString().split('T')[0];
}