const getWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = (day === 0 ? 6 : day - 1);
    const monday = new Date(today)
    monday.setDate(today.getDate() - diff);

    const dayOfMonth = String(monday.getDate()).padStart(2, '0');
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    const year = monday.getFullYear();
    return `${dayOfMonth}.${month}.${year}`;
}
export function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day); // Месяцы в JavaScript начинаются с 0
}

export function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Добавляем 1, т.к. месяцы начинаются с 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

export default getWeek