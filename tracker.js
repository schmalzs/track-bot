require('dotenv').config();
const fetch = require('node-fetch');

if (!process.env.TRACKER_API_TOKEN) {
    console.log('Error: Specify Tracker API token in environment');
    process.exit(1);
}
else if(!process.env.TRACKER_PROJECT_ID) {
    console.log('Error: Specify Tracker Project ID in environment');
    process.exit(1);
}

function getStoriesByState(state) {
    return fetch(`https://www.pivotaltracker.com/services/v5/projects/${process.env.TRACKER_PROJECT_ID}/stories?filter=state:${state}`, {
        headers: { 'X-TrackerToken': process.env.TRACKER_API_TOKEN }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.kind === 'error') {
            throw new Error(data.error);
        }
        return data;
    });
}

function setStoryState(storyId, state) {
    return fetch(`https://www.pivotaltracker.com/services/v5/projects/${process.env.TRACKER_PROJECT_ID}/stories/${storyId}`, {
        method: 'PUT',
        headers: {
            'X-TrackerToken': process.env.TRACKER_API_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "current_state": `${state}` })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.kind === 'error') {
            throw new Error(data.general_problem);
        }
        return data;
    });
}

function getStory(storyId) {
    console.log(`https://www.pivotaltracker.com/services/v5/projects/${process.env.TRACKER_PROJECT_ID}/stories/${storyId}`);
    return fetch(`https://www.pivotaltracker.com/services/v5/projects/${process.env.TRACKER_PROJECT_ID}/stories/${storyId}`, {
        headers: { 'X-TrackerToken': process.env.TRACKER_API_TOKEN }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.kind === 'error') {
            throw new Error(data.error);
        }
        return data;
    });
}

module.exports = {
    getStoriesByState: getStoriesByState,
    setStoryState: setStoryState,
    getStory: getStory
};
