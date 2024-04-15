export const getHour = (time) => {
    const timeparse = parseInt(time, 10);
    const date = new Date(timeparse);

    // Extract hours, minutes, seconds, and milliseconds
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();

    // Format the time string
    const formattedTime = hours.toString().padStart(2, '0') + ':' +
        minutes.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0') + '.' +
        milliseconds.toString().padStart(3, '0');

    return formattedTime;
}