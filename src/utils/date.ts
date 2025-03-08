export const oneYearFromNow = () => {
    // const date = new Date();
    // date.setFullYear(date.getFullYear() + 1);
    // return date;

    // in milisecond
    return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
};

export const thirtyDaysFromNow = () => {
    // in milisecond
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

export const fifteenMinutesFromNow = () => {
    // in milisecond
    return new Date(Date.now() + 15 * 60 * 1000);
}