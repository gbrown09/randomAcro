module.exports = {
    name: 'poll',
    description: 'make a poll  for voting',
    options: [
        {
            type: 3,
            name: 'question',
            description: 'what are you asking the people',
            default: false,
            required: true,
        },
        {
            type: 3,
            name: 'choices',
            description: 'give the people choices to vote on seperated by ;',
            default: false,
        },
    ],
};
