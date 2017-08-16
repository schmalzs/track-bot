function formatListOfStories(stories) {
    let formattedList = '';

    stories.forEach((story) => {
        formattedList += `<${story.url}|${story.name}>\n`;
    });

    return formattedList;
}

module.exports = {
    formatListOfStories: formatListOfStories
};
