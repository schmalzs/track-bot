require('dotenv').config();
const Botkit = require('botkit');
const tracker = require('./tracker');
const formatter = require('./formatter');

if (!process.env.SLACK_API_TOKEN) {
    console.log('Error: Specify Slack API token in environment');
    process.exit(1);
}

const STORY_STATE_BUTTONS = [{
    name: "state",
    text: "Unstarted",
    type: "button",
    value: "unstarted"
}, {
    name: "state",
    text: "Started",
    type: "button",
    value: "started"
}, {
    name: "state",
    text: "Finished",
    type: "button",
    value: "finished"
}, {
    name: "state",
    text: "Delivered",
    type: "button",
    value: "delivered"
}, {
    name: "state",
    text: "Accepted",
    type: "button",
    value: "accepted",
    style: "primary"
}, {
    name: "state",
    text: "Rejected",
    type: "button",
    value: "rejected",
    style: "danger",
}];

const controller = Botkit.slackbot({
    debug: true,
});

const bot = controller.spawn({
    token: process.env.SLACK_API_TOKEN
}).startRTM();

controller.hears([/how many stories (are )?in progress/], 'ambient', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        tracker.getStoriesByState('started').then((stories) => {
            bot.reply(message, JSON.stringify(stories.length));

        });
    });
});

controller.hears([/(what )?stories (are )?in progress/], 'ambient', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        tracker.getStoriesByState('started').then((stories) => {
            bot.reply(message, formatter.formatListOfStories(stories));
        });
    });
});

controller.hears(['delivered stories'], 'ambient', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        tracker.getStoriesByState('delivered').then((stories) => {
            bot.reply(message, formatter.formatListOfStories(stories));
        });
    });
});

controller.hears([/accept #?(?:\d+)$/], 'direct_mention,mention', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        const storyIdStartIndex = (message.text.lastIndexOf('#') || message.text.lastIndexOf(' ')) + 1;
        const storyId = message.text.substr(storyIdStartIndex, message.text.length - storyIdStartIndex + 1);
        tracker.setStoryState(storyId, 'accepted')
          .then(() => bot.reply(message, 'Story Accepted!'))
          .catch((err) => bot.reply(message, err.message));
    });
});

controller.hears([/#(?:\d+)$/], 'ambient', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        const storyIdStartIndex = message.text.lastIndexOf('#') + 1;
        const storyId = message.text.substr(storyIdStartIndex, message.text.length - storyIdStartIndex + 1);
        tracker.getStory(storyId).then((story) => {


            bot.reply(message, {
                "text": story.name,
                "attachments": [
                    {
                        "text": "Set the story's state",
                        "fallback": "You are unable to choose a state",
                        "callback_id": "wopr_game",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "actions": STORY_STATE_BUTTONS.filter((button) => button.value !== story.current_state)
                    }
                ]
            });
        }).catch(() => {
            bot.reply(message, 'Oops! unable to show story');
        });
    });
});

controller.hears(['who is the best team'], 'ambient', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, 'Not Matt and Andy...');
    });
});

controller.hears(['which college basketball team is the best'], 'ambient', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, 'SYRACUSE ORANGE');
    });
});
