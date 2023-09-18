// Construct a formatted date string using month, day, and year components.
function formatDate(date) {
  return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
      date
    ).getFullYear()}`;
}


module.exports = {
  formatDate
}