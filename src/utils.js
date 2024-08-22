const { DateTime } = require('luxon');
// Dhaka time zone (Asia/Dhaka)
const currentTimestamp = DateTime.utc();
const dhakaTimestamp = currentTimestamp.setZone('Asia/Dhaka');
const formattedTimestamp = dhakaTimestamp.toISO({ includeOffset: true });

const key = process.env.FERNET_SECRET;
const baseUrl = process.env.BASE_URL;
//const liveUrl = process.env.LIVE_URL;

module.exports = {
    key,
    baseUrl,
    formattedTimestamp,
}