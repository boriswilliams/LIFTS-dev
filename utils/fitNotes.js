FILE = 'data/FitNotes_Export.csv';

const fs = require('fs');

const convert = (source) => {
    let data = {
        exercises: {},
        nextExerciseIndex: 1,
    };
    let exerciseIndex = {};

    source = source.split("\n");
    for (let i = 1; i < source.length; i++) {
        source[i] = source[i].split(',');
        if (source[i][3] === '')
            continue
        if (!(source[i][1] in exerciseIndex)) {
            exerciseIndex[source[i][1]] = data.nextExerciseIndex;
            data.nextExerciseIndex += 1;
            data[`exercise_${exerciseIndex[source[i][1]]}_name`] = [source[i][1]];
            data[`exercise_${exerciseIndex[source[i][1]]}_history`] = [];
            data.exercises[`${exerciseIndex[source[i][1]]}`] = 0;
        }
        data[`exercise_${exerciseIndex[source[i][1]]}_history`].push({
            time: new Date(source[i][0]).getTime(),
            weight: Number(source[i][3]),
            reps: Number(source[i][5])
        });
    }

    return data;
}

const main = () => {
    fs.readFile(FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log(JSON.stringify(convert(data)));
    });
}

main();